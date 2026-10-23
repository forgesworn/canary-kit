import importlib.util
import pathlib
import plistlib
import tempfile
import unittest
import zipfile
import sys

sys.dont_write_bytecode = True

spec = importlib.util.spec_from_file_location("check_builds", pathlib.Path(__file__).with_name("check-builds.py"))
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)

PAGE = b'''<head><meta name="vouch-runtime" content="native"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'none'; frame-src 'none'; worker-src 'none'; manifest-src 'none'"></head>'''


class PackagingTests(unittest.TestCase):
    def test_native_page_requires_network_and_frame_restrictions(self):
        checks.check_page(PAGE)
        for page in (PAGE.replace(b'content="native"', b'content="web"'),
                     PAGE.replace(b"connect-src 'none'", b"connect-src 'self'"),
                     PAGE + b'<script src="https://example.test/app.js"></script>',
                     PAGE + b'<link rel="manifest" href="manifest.json">'):
            with self.assertRaises(ValueError):
                checks.check_page(page)

    def test_ios_rejects_missing_or_stale_bundled_page(self):
        with tempfile.TemporaryDirectory() as root:
            app = pathlib.Path(root) / "Vouch.app"
            app.mkdir()
            (app / "Info.plist").write_bytes(plistlib.dumps({"CFBundleIdentifier": checks.APP_ID, "CFBundleExecutable": "Vouch"}))
            (app / "Vouch").write_bytes(b"fixture executable")
            with self.assertRaisesRegex(ValueError, "missing bundled web/index.html"):
                checks.check_ios(app, PAGE)
            (app / "web").mkdir()
            (app / "web/index.html").write_bytes(b"stale")
            with self.assertRaisesRegex(ValueError, "differs"):
                checks.check_ios(app, PAGE)
            (app / "web/index.html").write_bytes(PAGE)
            self.assertEqual(checks.check_ios(app, PAGE)["bundledPageSha256"], checks.sha256(PAGE))

    def test_android_rejects_missing_or_stale_bundled_page(self):
        with tempfile.TemporaryDirectory() as root:
            apk = pathlib.Path(root) / "Vouch.apk"
            for page in (None, b"stale", PAGE):
                with zipfile.ZipFile(apk, "w") as archive:
                    if page is not None:
                        archive.writestr("assets/index.html", page)
                if page is PAGE:
                    self.assertEqual(checks.check_android(apk, PAGE)["bundledPageSha256"], checks.sha256(PAGE))
                else:
                    with self.assertRaises(ValueError):
                        checks.check_android(apk, PAGE)


if __name__ == "__main__":
    unittest.main()
