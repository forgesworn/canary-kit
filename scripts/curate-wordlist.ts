/**
 * Wordlist curation script for Wordchain en-v1.
 *
 * Filters the BIP-39 English wordlist for spoken-word clarity,
 * then backfills with supplementary words to maintain exactly 2048 entries.
 *
 * Run: npx tsx scripts/curate-wordlist.ts
 * Output: curated wordlist to stdout, review notes to stderr
 */

// Words to remove: homophones and phonetically confusable pairs
const HOMOPHONES = new Set([
  'altar', 'alter',    // sound identical
  'bare', 'bear',      // homophone pair
  'dear', 'deer',      // homophone pair
  'flour', 'flower',   // homophone pair
  'hair', 'hare',      // homophone pair
  'heir',              // sounds like "air"
  'knight',            // sounds like "night"
  'know',              // sounds like "no"
  'maid', 'made',      // homophone pair
  'mail', 'male',      // homophone pair
  'meat', 'meet',      // homophone pair
  'night',             // sounds like "knight"
  'none', 'nun',       // homophone pair
  'one', 'won',        // homophone pair
  'pair', 'pear',      // homophone pair
  'peace', 'piece',    // homophone pair
  'right', 'write',    // homophone pair
  'sail', 'sale',      // homophone pair
  'scene', 'seen',     // homophone pair
  'sea', 'see',        // homophone pair
  'son', 'sun',        // homophone pair
  'stair', 'stare',    // homophone pair
  'steel', 'steal',    // homophone pair
  'tail', 'tale',      // homophone pair
  'their', 'there',    // homophone pair
  'threw', 'through',  // homophone pair
  'toe', 'tow',        // homophone pair
  'vain', 'vein',      // homophone pair
  'wait', 'weight',    // homophone pair
  'waste', 'waist',    // homophone pair
  'weak', 'week',      // homophone pair
  'wear', 'where',     // homophone pair
  'weather',           // sounds like "whether"
  'which', 'witch',    // homophone pair
  'wood', 'would',     // homophone pair
  'wrap', 'rap',       // homophone pair
])

// Phonetically confusable over degraded audio (LoRa, bad phone line)
const CONFUSABLE = new Set([
  'ship', 'chip',      // sh/ch confusion
  'thin', 'fin',       // th/f confusion
  'three', 'tree', 'free', // th/tr/fr confusion
  'sink', 'think',     // s/th confusion
  'sing', 'thing',     // s/th confusion
  'sat', 'that',       // s/th confusion
  'bat', 'pat', 'mat', // b/p/m confusion
  'bit', 'pit',        // b/p confusion
  'bet', 'pet',        // b/p confusion
  'big', 'pig',        // b/p confusion
  'bin', 'pin',        // b/p confusion
  'den', 'ten',        // d/t confusion
  'dim', 'tim',        // d/t not in list but pattern
  'fan', 'van',        // f/v confusion
  'fine', 'vine',      // f/v confusion
  'few', 'view',       // f/v confusion
])

// Words unsuitable for spoken verification context
const UNSUITABLE = new Set([
  // Alarming if overheard
  'abandon', 'abuse', 'angry', 'arrest', 'assault',
  'betray', 'blade', 'blast', 'bleed', 'blind',
  'blood', 'bomb', 'broken', 'bullet', 'burden',
  'cannon', 'chaos', 'chronic', 'collapse', 'conflict',
  'crash', 'crazy', 'crime', 'cruel', 'crush',
  'damage', 'debris', 'deny', 'despair', 'destroy',
  'disease', 'dismiss', 'disorder', 'dose', 'dread',
  'drip', 'drown', 'drug', 'drunk', 'dumb',
  'erupt', 'evoke', 'excess', 'exile', 'expire',
  'expose', 'fatal', 'fault', 'flee', 'fury',
  'ghost', 'grief', 'grit', 'guilty', 'gun',
  'harsh', 'hazard', 'horror', 'hurt', 'illegal',
  'illness', 'immense', 'impose', 'impulse', 'injury',
  'insane', 'isolate',
  'jealous', 'junk',
  'lawsuit', 'limb', 'lonely', 'lyrics',
  'mad', 'misery', 'monster', 'mule',
  'nasty', 'neglect', 'nerve',
  'obscure', 'obvious', 'occur',
  'panic', 'penalty', 'pistol', 'plunge', 'poverty',
  'prison', 'problem', 'punch', 'pupil',
  'quit',
  'raccoon', 'rage', 'rebel', 'regret', 'reject',
  'remind', 'resemble', 'resist', 'revenge', 'rigid', 'riot',
  'rough', 'rude', 'ruin',
  'sad', 'scare', 'scatter', 'scheme', 'scissors',
  'scrap', 'series', 'shaft', 'shiver', 'shock',
  'shrug', 'siege', 'siren', 'skull', 'slender',
  'slogan', 'slot', 'slow', 'slush', 'smash',
  'smoke', 'snap', 'sniff', 'sob', 'sorry',
  'spawn', 'split', 'squeeze', 'stab',
  'sting', 'strike', 'struggle', 'stuff', 'stumble',
  'stupid', 'suffer', 'suspect', 'swallow', 'swamp',
  'swear', 'symptom',
  'tank', 'target', 'tattoo', 'tenant', 'tent',
  'tobacco', 'tongue', 'tornado', 'toward', 'tragic',
  'trash', 'trial', 'trouble', 'truly', 'trust',
  'tube', 'tumble', 'tuna',
  'ugly', 'unhappy', 'unveil',
  'vacant', 'vacuum', 'vanish', 'vault', 'venture',
  'victim', 'virus', 'void', 'volume', 'vomit',
  'wage', 'warfare', 'weapon', 'weird', 'wicked',
  'wrist', 'wrong',
])

// Two-letter words not in BIP-39 but checking anyway
const TOO_SHORT = new Set(['ad', 'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he',
  'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we'])

// Supplementary words: concrete, clear, easy to say and hear
// These are common English words NOT in BIP-39 that are good for spoken verification
const SUPPLEMENTARY = [
  'acorn', 'admiral', 'alpine', 'amber', 'anvil', 'apron',
  'badger', 'bakery', 'balm', 'bamboo', 'banjo', 'basil',
  'beacon', 'beetle', 'belfry', 'berry', 'birch', 'bishop',
  'bloom', 'bobcat', 'bonfire', 'bouquet', 'branch', 'breaker',
  'brook', 'buckle', 'bugle', 'bumble', 'burrow', 'bushel',
  'cactus', 'cairn', 'camel', 'canopy', 'cape', 'caravan',
  'cedar', 'cellar', 'charter', 'cherry', 'chestnut', 'cider',
  'clam', 'cliff', 'cloak', 'cobalt', 'cocoa', 'codex',
  'comet', 'condor', 'consul', 'cork', 'cornet', 'cosmos',
  'cougar', 'cradle', 'crane', 'crater', 'cricket', 'croft',
  'crown', 'crystal', 'current', 'cypress',
  'dagger', 'dahlia', 'damsel', 'dapple', 'delta', 'denim',
  'depot', 'dolphin', 'donkey', 'dorsal', 'drafter', 'drake',
  'drifter', 'droplet', 'drummer', 'dulcet', 'dungeon', 'dusk',
  'eagle', 'edgeway', 'elder', 'elm', 'ember', 'emerald',
  'ensign', 'epoch', 'estuary', 'ether', 'everest',
  'falcon', 'fallow', 'fathom', 'fennel', 'fern', 'fiddle',
  'finch', 'fjord', 'flagon', 'flannel', 'flicker', 'flint',
  'flock', 'floret', 'flutter', 'foal', 'forest', 'forge',
  'fossil', 'foundry', 'foxglove', 'fresco', 'frost', 'furrow',
  'galley', 'garland', 'garnet', 'gazelle', 'geyser', 'gibbon',
  'ginger', 'glacier', 'glen', 'goblet', 'golden', 'gopher',
  'gorge', 'granite', 'guppy', 'gust',
  'hamlet', 'hammock', 'harbor', 'harness', 'harvest', 'hawthorn',
  'hearth', 'hedgehog', 'herald', 'hermit', 'heron', 'hickory',
  'hollow', 'homeward', 'horizon', 'hornet', 'howler', 'hunter',
  'igloo', 'indigo', 'inkwell', 'inlet', 'inward', 'iris',
  'island', 'ivory',
  'jacket', 'jade', 'jasmine', 'javelin', 'jersey', 'jewel',
  'jostle', 'journal', 'jubilee', 'jumble', 'junco', 'juniper',
  'kayak', 'keeper', 'kelp', 'kennel', 'kernel', 'kestrel',
  'kettle', 'kindle', 'kinglet', 'kipper', 'kiwi', 'knapsack',
  'lantern', 'lapis', 'larch', 'laurel', 'lavender', 'lemon',
  'leopard', 'lichen', 'linden', 'linnet', 'llama', 'lobster',
  'locust', 'lodge', 'loom', 'lotus', 'lumber', 'lumen',
  'mackerel', 'magnet', 'mango', 'mantis', 'maple', 'marsh',
  'marten', 'masonry', 'meadow', 'merlin', 'mesa', 'micron',
  'millet', 'mirage', 'minnow', 'mirror', 'moat', 'mohawk',
  'monarch', 'mongrel', 'mortar', 'mosaic', 'moose', 'mullet',
  'muslin', 'mussel', 'mustang', 'myrtle',
  'napkin', 'narwhal', 'nectar', 'nester', 'nettle', 'newt',
  'nimble', 'noggin', 'nomad', 'noodle', 'nutmeg',
  'oakmoss', 'oasis', 'obsidian', 'octave', 'olive', 'onyx',
  'opal', 'orchid', 'oriole', 'osprey', 'otter', 'outpost',
  'paddle', 'pagoda', 'palm', 'panther', 'parcel', 'parrot',
  'pasture', 'pebble', 'pelican', 'pendant', 'penguin', 'pepper',
  'perch', 'pewter', 'phoenix', 'picket', 'pillar', 'pilot',
  'plaster', 'plover', 'plume', 'pocket', 'pollen', 'poplar',
  'portal', 'possum', 'potter', 'prancer', 'prism', 'puffin',
  'pumice', 'python',
  'quarry', 'quartz', 'quiver',
  'rabbit', 'radish', 'rafter', 'rambler', 'rampant', 'ranger',
  'raptor', 'rattan', 'raven', 'redwood', 'reef', 'ribbon',
  'ridgeway', 'riffle', 'ripple', 'river', 'robin', 'rocket',
  'rosemary', 'rowan', 'ruby', 'runner', 'russet',
  'saddle', 'saffron', 'salmon', 'sandal', 'sapphire', 'satchel',
  'sawmill', 'scallop', 'scarlet', 'seagull', 'sequoia', 'shelter',
  'shingle', 'shuttle', 'sierra', 'silver', 'simmer', 'skipper',
  'slipper', 'socket', 'sorrel', 'sparrow', 'spindle', 'sprocket',
  'steeple', 'stopper', 'summit', 'sunbeam', 'swallow', 'sycamore',
  'talon', 'tamper', 'tangle', 'tartan', 'temple', 'terrace',
  'thicket', 'thistle', 'thrush', 'thunder', 'tidal', 'timber',
  'tinker', 'topaz', 'torrent', 'trapper', 'treble', 'trident',
  'trinket', 'trombone', 'tropic', 'trotter', 'truffle', 'trumpet',
  'tucson', 'tulip', 'tundra', 'tunnel', 'turret',
  'urchin', 'utensil',
  'valley', 'vantage', 'velvet', 'veranda', 'verdant', 'vessel',
  'viaduct', 'village', 'violet', 'viper', 'visor', 'volcano',
  'voyager',
  'waffle', 'walnut', 'warden', 'warbler', 'warren', 'weasel',
  'weaver', 'whisker', 'whistle', 'wicket', 'widget', 'willow',
  'windmill', 'window', 'winter', 'wizard', 'wombat', 'wonder',
  'woodlark', 'wren',
  'yarrow', 'yearling',
  'zenith', 'zephyr', 'zigzag', 'zodiac',
]

async function main() {
  // Read current wordlist from built output
  const mod = await import('../dist/wordlist.js')
  const bip39: string[] = [...mod.WORDLIST]

  const removeSet = new Set<string>()

  for (const word of bip39) {
    if (HOMOPHONES.has(word)) removeSet.add(word)
    if (CONFUSABLE.has(word)) removeSet.add(word)
    if (UNSUITABLE.has(word)) removeSet.add(word)
    if (TOO_SHORT.has(word)) removeSet.add(word)
  }

  // Filter
  const kept = bip39.filter(w => !removeSet.has(w))

  console.error(`BIP-39 words: ${bip39.length}`)
  console.error(`Removed: ${removeSet.size}`)
  console.error(`Kept: ${kept.length}`)
  console.error(`Need: ${2048 - kept.length} supplementary words`)

  // Deduplicate supplementary against kept words
  const keptSet = new Set(kept)
  const available = SUPPLEMENTARY
    .map(w => w.toLowerCase().trim())
    .filter(w => !keptSet.has(w))
    .filter(w => w.length >= 3 && w.length <= 8)
    .filter(w => /^[a-z]+$/.test(w))

  console.error(`Supplementary available (after dedup + filter): ${available.length}`)

  const needed = 2048 - kept.length
  if (available.length < needed) {
    console.error(`ERROR: Not enough supplementary words! Have ${available.length}, need ${needed}`)
    console.error(`Shortfall: ${needed - available.length}`)
    // Still output what we have
  }

  const final = [...kept, ...available.slice(0, needed)].sort()

  // Check for duplicates
  const finalSet = new Set(final)
  if (finalSet.size !== final.length) {
    console.error(`ERROR: Duplicates found! ${final.length - finalSet.size} duplicates`)
  }

  console.error(`\nFinal wordlist: ${final.length} words`)
  console.error(`Length range: ${Math.min(...final.map(w => w.length))}-${Math.max(...final.map(w => w.length))}`)

  // Output final list
  for (const w of final) {
    console.log(w)
  }

  // Output removed words for review
  console.error('\n--- Removed from BIP-39 ---')
  const removed = [...removeSet].sort()
  for (const w of removed) {
    const reasons: string[] = []
    if (HOMOPHONES.has(w)) reasons.push('homophone')
    if (CONFUSABLE.has(w)) reasons.push('confusable')
    if (UNSUITABLE.has(w)) reasons.push('unsuitable')
    console.error(`  ${w}: ${reasons.join(', ')}`)
  }
}

main()
