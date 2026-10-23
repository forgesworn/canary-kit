#!/usr/bin/env python3
"""Check the actual native packages, rather than only their source/build exit codes."""
import argparse
import datetime
import hashlib
from html.parser import HTMLParser
import json
import pathlib
import plistlib
import zipfile

APP_ID = "dev.forgesworn.vouch.prototype"


def sha256(value):
    return hashlib.sha256(value).hexdigest()


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def check_page(page):
    parsed = Page()
    parsed.feed(page.decode("utf-8"))
    if not any(tag == "meta" and attrs.get("name") == "vouch-runtime" and attrs.get("content") == "native" for tag, attrs in parsed.tags):
        raise ValueError("Bundled page is missing the native runtime marker")
    policies = [attrs.get("content", "") for tag, attrs in parsed.tags if tag == "meta" and attrs.get("http-equiv", "").lower() == "content-security-policy"]
    if len(policies) != 1:
        raise ValueError("Bundled page must contain one restrictive CSP")
    directives = {}
    for directive in policies[0].split(";"):
        parts = directive.split()
        if parts:
            if parts[0] in directives:
                raise ValueError("Duplicate bundled CSP directive")
            directives[parts[0]] = parts[1:]
    for name in ("default-src", "connect-src", "frame-src", "worker-src", "manifest-src"):
        if directives.get(name) != ["'none'"]:
            raise ValueError(f"Bundled CSP must disable {name}")
    for tag, attrs in parsed.tags:
        if (tag == "script" and "src" in attrs) or (tag == "link" and "href" in attrs):
            raise ValueError("Native page must bundle scripts and omit linked resources")


def check_android(apk, page):
    with zipfile.ZipFile(apk) as archive:
        if archive.namelist().count("assets/index.html") != 1:
            raise ValueError("Android package is missing a unique bundled assets/index.html")
        if archive.read("assets/index.html") != page:
            raise ValueError("Android bundled page differs from the native candidate")
    return {"file": apk.name, "sha256": sha256(apk.read_bytes()), "bundledPageSha256": sha256(page)}


def check_ios(app, page):
    bundled = app / "web/index.html"
    if not bundled.is_file():
        raise ValueError("iOS app is missing bundled web/index.html")
    if bundled.read_bytes() != page:
        raise ValueError("iOS bundled page differs from the native candidate")
    info = plistlib.loads((app / "Info.plist").read_bytes())
    if info.get("CFBundleIdentifier") != APP_ID:
        raise ValueError("Unexpected iOS application identifier")
    executable = info.get("CFBundleExecutable")
    if not isinstance(executable, str) or pathlib.Path(executable).name != executable:
        raise ValueError("Unexpected iOS executable name")
    binary = app / executable
    if not binary.is_file():
        raise ValueError("iOS app is missing its executable")
    # Deterministic digest of the complete signed bundle, including resources/profile.
    inventory = []
    for path in sorted(app.rglob("*")):
        if path.is_symlink():
            raise ValueError("Unexpected symlink in iOS application bundle")
        if path.is_file():
            inventory.append([path.relative_to(app).as_posix(), sha256(path.read_bytes())])
    return {"file": app.name, "bundleIdentifier": APP_ID, "executableSha256": sha256(binary.read_bytes()),
            "bundleInventorySha256": sha256(json.dumps(inventory, separators=(",", ":")).encode()),
            "bundledPageSha256": sha256(page)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html", type=pathlib.Path, default=pathlib.Path(__file__).parent / "web/index.html")
    parser.add_argument("--android", type=pathlib.Path)
    parser.add_argument("--ios", type=pathlib.Path)
    parser.add_argument("--out", type=pathlib.Path)
    args = parser.parse_args()
    if not args.android and not args.ios:
        parser.error("Supply --android and/or --ios")
    page = args.html.read_bytes()
    check_page(page)
    report = {"verified": datetime.datetime.now(datetime.timezone.utc).isoformat(), "nativePageSha256": sha256(page)}
    if args.android:
        report["android"] = check_android(args.android, page)
    if args.ios:
        report["ios"] = check_ios(args.ios, page)
    output = json.dumps(report, indent=2) + "\n"
    if args.out:
        args.out.write_text(output)
    print(output, end="")


if __name__ == "__main__":
    main()
