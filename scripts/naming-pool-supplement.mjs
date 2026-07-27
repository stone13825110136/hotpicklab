/**
 * Curated open pet-name bank used when NYC Open Data is unavailable.
 * Keeps letter / gender / vibe filters logically associated (~1000 target).
 * Not scraped from proprietary sites.
 */
export const POOL_SUPPLEMENT = [
  // A
  'Ace','Ada','Aiden','Aiko','Alba','Albert','Alec','Alex','Alfie','Alice','Alma','Amber','Amelia','Amos','Amy','Angel','Angus','Annie','Anouk','Aphrodite','Apollo','April','Aria','Ariel','Arlo','Arrow','Arthur','Ash','Asher','Aspen','Aster','Athena','Atlas','Audrey','Aurora','Ava','Avery','Axel','Azul',
  // B
  'Babe','Bailey','Bam','Bambi','Bandit','Banjo','Barbie','Barkley','Barnaby','Basil','Baxter','Bean','Bear','Beau','Beck','Becks','Bella','Belle','Benji','Benny','Bernie','Berry','Bessie','Betsy','Betty','Bianca','Bingo','Birdie','Biscuit','Bishop','Blaze','Blossom','Blue','Bo','Bobbi','Bolt','Bonnie','Boomer','Boots','Boris','Boston','Bowie','Brady','Breeze','Briar','Brie','Brodie','Brooks','Bruno','Bubbles','Buck','Buddy','Buffy','Buster','Butter','Button','Byte',
  // C
  'Cali','Callie','Calvin','Cam','Cami','Candy','Captain','Cara','Carl','Cash','Casper','Cassie','Cedar','Celeste','Chance','Charlie','Chase','Chester','Chewy','Chico','Chili','Chip','Chloe','Chonk','Cinnamon','Cipher','Cisco','Clara','Cleo','Cliff','Clover','Clyde','Coco','Cody','Coffee','Cola','Comet','Cookie','Cooper','Cora','Coral','Cosmo','Cotton','Cricket','Cruz','Cub','Cupcake','Curly','Cyrus',
  // D
  'Daffodil','Daisy','Dakota','Dallas','Daphne','Darcy','Dash','Dashi','Davey','Dax','Delta','Denver','Destiny','Dex','Dexter','Diego','Diesel','Dillon','Dino','Dixie','Django','Dodge','Domino','Donut','Doodle','Doris','Dory','Dot','Dottie','Dove','Doyle','Drake','Dream','Drift','Duchess','Duffy','Duke','Duncan','Dune','Dusty',
  // E
  'Earl','Echo','Eclipse','Eddie','Eddy','Eden','Edgar','Edie','Edwin','Elfie','Eliza','Ella','Ellen','Ellie','Ellis','Elmo','Elodie','Elsa','Elvis','Ember','Emily','Emma','Emmy','Enzo','Eric','Erin','Ernie','Esme','Esther','Eva','Evan','Eve','Ever','Evie','Ezra',
  // F
  'Fable','Faith','Fawn','Felix','Fern','Fifi','Fig','Finn','Fiona','Fisher','Fizz','Flame','Flash','Flint','Flora','Floyd','Fluffy','Flynn','Forest','Fortune','Fox','Foxy','Frankie','Fred','Freya','Fritz','Frost','Fudge','Fuji','Fuzzy',
  // G
  'Gabe','Gale','Garnet','Gatsby','Gemma','George','Ghost','Gigi','Ginger','Ginny','Gizmo','Glen','Gloria','Glyph','Goliath','Goose','Gordon','Grace','Graham','Greta','Grey','Greyson','Griffin','Gumdrop','Gunner','Gus','Gwen',
  // H
  'Haiku','Halo','Hank','Happy','Harbor','Harley','Harper','Harvey','Hawk','Haze','Hazel','Heath','Hector','Heidi','Henry','Hera','Hero','Hershey','Hilda','Holly','Honey','Hope','Hopper','Horace','Hudson','Huey','Hugo','Huxley','Hyde',
  // I
  'Ian','Ice','Icon','Ida','Iggy','Ike','Indigo','Ink','Inky','Io','Iona','Iori','Ira','Iris','Isa','Isla','Ivory','Ivy','Izzy',
  // J
  'Jack','Jackie','Jacob','Jade','Jagger','Jake','James','Jamie','Janis','Jasper','Jax','Jazz','Jedi','Jelly','Jem','Jersey','Jesse','Jet','Jett','Jewel','Jinx','Joan','Joey','John','Joker','Joni','Jordan','Jose','Joy','Jude','Jules','Julia','Juliet','June','Junior','Juniper','Juno','Jupiter',
  // K
  'Kai','Kane','Karma','Kate','Katie','Kaya','Keanu','Keiko','Kell','Kenai','Kenny','Kettle','Kiki','Kimchi','King','Kinley','Kira','Kit','Kite','Kiwi','Knox','Kobe','Koda','Koji','Koko','Kona','Kurt','Kyle','Kyra',
  // L
  'Lacey','Lady','Lane','Lark','Layla','Leaf','Leo','Leon','Lex','Lexi','Liberty','Lily','Lime','Lincoln','Loki','Lola','Louie','Louis','Lou','Lotus','Lucky','Lucy','Ludo','Luis','Lulu','Lumen','Luna','Lux','Lynx','Lyric',
  // M
  'Mabel','Mac','Macy','Maggie','Magnolia','Maisie','Mango','Maple','Marley','Marlow','Marsh','Marty','Mason','Matilda','Maui','Maverick','Max','Maya','Meadow','Mel','Melody','Mercury','Mia','Mickey','Mika','Mila','Miles','Millie','Milo','Mimi','Mint','Miso','Misty','Mocha','Mochi','Moe','Molly','Mona','Monroe','Monty','Moon','Moose','Morgan','Mose','Moss','Moxie','Muffin','Murphy','Mystic',
  // N
  'Nacho','Nadia','Nala','Nancy','Nash','Nate','Navy','Ned','Nell','Nellie','Nemo','Neo','Nerissa','Nia','Nick','Nico','Nigel','Nike','Nina','Nimbus','Noah','Noir','Nola','Nora','Nori','Norman','Nova','Nugget','Nutmeg','Nyx',
  // O
  'Oak','Oakley','Obie','Ocean','Octavia','Odin','Olive','Oliver','Ollie','Onyx','Oona','Opal','Opie','Ora','Orbit','Oreo','Oscar','Otis','Otto','Otter','Owen','Oz','Ozzy',
  // P
  'Pace','Pablo','Paisley','Panda','Parker','Pax','Peaches','Pearl','Pebble','Penny','Pepper','Percy','Perry','Pesto','Petal','Petunia','Phoenix','Picasso','Pickles','Pilot','Pine','Pinky','Pip','Piper','Pippin','Pixel','Plum','Poe','Polo','Poppy','Porter','Primo','Princess','Puck','Pudding','Pulse','Pumpkin','Punch','Pup','Purdy',
  // Q
  'Quark','Queen','Queenie','Quentin','Queso','Quest','Questa','Quill','Quillan','Quillow','Quin','Quincy','Quinn','Quip','Quokka','Quilt','Quorra','Qubit',
  // R
  'Rags','Rain','Rainbow','Ralph','Rambo','Ranger','Raven','Ray','Red','Reese','Remi','Remy','Rex','Rhett','Rhino','Rico','Ridge','Riley','Rio','Ripley','Ritz','River','Roadie','Rocco','Rocket','Rocky','Roland','Romeo','Rory','Rosa','Rosie','Rover','Roux','Rowan','Roxy','Ruby','Rudy','Rune','Russell','Rusty',
  // S
  'Sable','Sage','Sailor','Sally','Sam','Sammy','Sandy','Sarge','Sasha','Scout','Shadow','Shane','Shelby','Sherlock','Shiloh','Sid','Sierra','Simba','Simon','Skye','Sky','Smokey','Snoopy','Snow','Snowball','Socks','Sol','Sonic','Sophie','Soot','Spice','Spike','Spirit','Spot','Sprig','Sprout','Star','Stella','Sterling','Storm','Sugar','Suki','Sunny','Sushi','Sydney','Syd',
  // T
  'Taffy','Tango','Tank','Tansy','Tasha','Teddy','Tess','Theo','Thor','Thunder','Tibby','Tide','Tiger','Tilly','Tinker','Toast','Toby','Tofu','Tom','Tommy','Tone','Tony','Tootsie','Torch','Trek','Trinket','Tripp','Trooper','Tucker','Tux','Twix','Ty',
  // U
  'Ube','Udo','Ugo','Uli','Uliya','Ulla','Uma','Umbra','Ume','Umi','Unity','Uno','Urban','Uri','Uriah','Uriel','Usha',
  // V
  'Vader','Vale','Valor','Veda','Vega','Velvet','Vera','Vernon','Vesper','Vic','Victor','Vinnie','Vince','Vinny','Violet','Vito','Vivi','Vixen','Volt','Voyage','Vibe',
  // W
  'Wade','Waffles','Walker','Walnut','Walt','Wanda','Watson','Wendy','Wes','Whisk','Whiskey','Willow','Willa','Windy','Winks','Winnie','Winston','Wisp','Wolf','Wolfie','Wren','Wicks','Wynn',
  // X
  'Xabi','Xander','Xan','Xena','Xeno','Xerox','Xerxes','Xiah','Xion','Xo','Xuri','Xavi','Xyla','Xyra',
  // Y
  'Yale','Yara','Yarrow','Yeti','Yves','Yogi','York','YoYo','Yule','Yumi','Yuna','Yuri','Yuzu','Yvie',
  // Z
  'Zane','Zara','Zeke','Zelda','Zephyr','Zesty','Ziggy','Zion','Zia','Zinnia','Zoe','Zola','Zoom','Zorro','Zuri','Zuzu','Zeus',
  // Breed-association anchors (must stay in pool so breed filter links)
  'Frenchie','Porkchop','Golden','Arctic','Loaf','Wiener','Hotdog','Pom','Tiny','Ming','Blitz','Doxie','Archie','Millie','Butch',
];

/** Breed → preferred names (must appear in pools for logical association). */
export const HEURISTIC_BREED_TOPS = {
  labrador: ['Buddy', 'Bailey', 'Max', 'Charlie', 'Cooper', 'Daisy', 'Bella', 'Lucy', 'Molly', 'Duke', 'Maggie', 'Toby'],
  'golden-retriever': ['Bailey', 'Charlie', 'Buddy', 'Daisy', 'Molly', 'Scout', 'Maggie', 'Cooper', 'Golden', 'Sunny'],
  'french-bulldog': ['Winston', 'Lola', 'Milo', 'Mochi', 'Gus', 'Bruno', 'Ollie', 'Frenchie', 'Porkchop', 'Biscuit'],
  'german-shepherd': ['Rex', 'Duke', 'Shadow', 'Zeus', 'Bear', 'Rocky', 'Max', 'Luna', 'Gunner', 'Athena'],
  poodle: ['Coco', 'Teddy', 'Toby', 'Milo', 'Bella', 'Charlie', 'Ruby', 'Daisy', 'Piper', 'Gigi'],
  beagle: ['Snoopy', 'Bailey', 'Buddy', 'Daisy', 'Penny', 'Milo', 'Charlie', 'Molly', 'Beau', 'Scout'],
  bulldog: ['Tank', 'Bruno', 'Diesel', 'Rocky', 'Gus', 'Rosie', 'Max', 'Rocco', 'Butch', 'Spike'],
  'yorkshire-terrier': ['Bella', 'Coco', 'Teddy', 'Princess', 'Milo', 'Chloe', 'Max', 'Benji', 'Gigi', 'Ruby'],
  husky: ['Luna', 'Blue', 'Shadow', 'Ghost', 'Zeus', 'Loki', 'Storm', 'Sky', 'Blaze', 'Arctic'],
  corgi: ['Winston', 'Archie', 'Pepper', 'Oliver', 'Millie', 'Charlie', 'Gizmo', 'Watson', 'Loaf', 'Biscuit'],
  'shih-tzu': ['Bella', 'Oreo', 'Coco', 'Teddy', 'Gizmo', 'Princess', 'Cookie', 'Milo', 'Fluffy', 'Pearl'],
  dachshund: ['Lucy', 'Frankie', 'Oscar', 'Penny', 'Otto', 'Milo', 'Daisy', 'Wiener', 'Hotdog', 'Bean'],
  pomeranian: ['Coco', 'Teddy', 'Foxy', 'Mochi', 'Princess', 'Leo', 'Simba', 'Buddy', 'Pom', 'Tiny'],
  persian: ['Princess', 'Fluffy', 'Coco', 'Pearl', 'Misty', 'Simba', 'Chloe', 'Luna', 'Oliver', 'Bella'],
  siamese: ['Ming', 'Lotus', 'Jade', 'Shadow', 'Cleo', 'Oscar', 'Luna', 'Milo', 'Nala', 'Simba'],
  'maine-coon': ['Thor', 'Odin', 'Maple', 'Forest', 'Bear', 'Luna', 'Athena', 'Simba', 'Oliver', 'Shadow'],
  ragdoll: ['Cloud', 'Cotton', 'Angel', 'Mochi', 'Luna', 'Milo', 'Bella', 'Coco', 'Pearl', 'Oliver'],
  'british-shorthair': ['Winston', 'Arthur', 'Blue', 'Smokey', 'Oliver', 'Bella', 'Charlie', 'Lucy', 'Max', 'Queenie'],
  bengal: ['Tiger', 'Leo', 'Zara', 'Blitz', 'Nala', 'Simba', 'Shadow', 'Jinx', 'Karma', 'Nova'],
  'scottish-fold': ['Bean', 'Button', 'Pip', 'Olive', 'Milo', 'Luna', 'Mochi', 'Coco', 'Teddy', 'Biscuit'],
  sphynx: ['Ziggy', 'Jinx', 'Nova', 'Echo', 'Pixel', 'Cosmo', 'Velvet', 'Luna', 'Milo', 'Onyx'],
};
