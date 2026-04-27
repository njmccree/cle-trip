// Cleveland Trip — activities dataset
// Curated for a group of 8 first-timer friends (24-32).
// To add a real photo: set `image: 'https://...'` on an activity.
// Otherwise the card renders a gradient background with the category emoji.

const CATEGORIES = {
  food:        { label: 'Food',        emoji: '🍔', gradient: ['#ff6b6b', '#ffa94d'] },
  bars:        { label: 'Bars & Nightlife', emoji: '🍻', gradient: ['#7c3aed', '#ec4899'] },
  museums:     { label: 'Culture',     emoji: '🎭', gradient: ['#0ea5e9', '#6366f1'] },
  sports:      { label: 'Sports & Parks', emoji: '⚾',  gradient: ['#10b981', '#22d3ee'] },
  nearby:      { label: 'Day Trip',    emoji: '🏝️', gradient: ['#f59e0b', '#10b981'] },
  golf:        { label: 'Golf',        emoji: '⛳',  gradient: ['#16a34a', '#84cc16'] }
};

const ACTIVITIES = [
  // ===== FOOD (25) =====
  { id: 'west-side-market', title: 'West Side Market', category: 'food', emoji: '🥩',
    description: 'Cleveland\'s 100+ year-old public market — meats, pierogi, Hungarian crepes, and more under one beautiful vaulted ceiling. Great group breakfast or lunch stop.',
    info: '1979 W 25th St • Mon/Wed 7a-4p, Fri/Sat 7a-6p • Closed Tue/Thu/Sun • Iconic',
    tags: ['breakfast', 'lunch', 'iconic', 'group-friendly'] },

  { id: 'slymans', title: "Slyman's Deli", category: 'food', emoji: '🥪',
    description: 'Legendary corned beef sandwich — piled comically high. Presidents have eaten here. Cash-only old-school deli vibe, lines move fast.',
    info: '3106 St Clair Ave NE • Mon-Fri 7a-2:30p • Cash only • Cleveland classic',
    tags: ['lunch', 'iconic', 'cheap-eats'] },

  { id: 'mabels-bbq', title: "Mabel's BBQ", category: 'food', emoji: '🍖',
    description: 'Michael Symon\'s Cleveland-style BBQ — Eastern European spices, mustard sauce, and beer. Built for sharing, made for a group.',
    info: '2050 E 4th St (East 4th) • Dinner nightly • Reservations recommended for groups',
    tags: ['dinner', 'group-friendly', 'celebrity-chef'] },

  { id: 'lola-bistro', title: 'Lola Bistro', category: 'food', emoji: '🍽️',
    description: 'Symon\'s flagship fine-dining spot on East 4th. Pricey but unforgettable — pierogi, beef cheek, killer cocktails. Save this for one nice group dinner.',
    info: '2058 E 4th St • Dinner Wed-Sun • Reservations essential • $$$',
    tags: ['date-night', 'special-occasion', 'celebrity-chef'] },

  { id: 'mitchells-icecream', title: "Mitchell's Homemade Ice Cream", category: 'food', emoji: '🍦',
    description: 'Local-favorite scoop shop in a beautifully restored old movie theater in Ohio City. You can watch them make it.',
    info: '1867 W 25th St • Open daily • Walk-up friendly',
    tags: ['dessert', 'casual', 'photogenic'] },

  { id: 'sterles', title: "Sterle's Slovenian Country House", category: 'food', emoji: '🥟',
    description: 'Cleveland\'s biggest ethnic group hangout — schnitzel, sausages, polkas on weekends. Bring the whole crew, it\'s a vibe.',
    info: '1401 E 55th St • Wed-Sun • Polka brunch Sundays • Group-friendly',
    tags: ['dinner', 'weird-fun', 'group-friendly', 'unique'] },

  { id: 'mama-santas', title: "Mama Santa's (Little Italy)", category: 'food', emoji: '🍕',
    description: 'Old-school Sicilian pizza and pasta on Murray Hill. No-frills, no website, packed every night. The Little Italy starter pack.',
    info: '12305 Mayfield Rd • Cash preferred • No reservations',
    tags: ['dinner', 'cheap-eats', 'iconic'] },

  { id: 'prestis-bakery', title: "Presti's Bakery", category: 'food', emoji: '🥐',
    description: 'Little Italy bakery institution — cassata cake, cannoli, and the best Italian cookies in town. Perfect coffee-and-pastry stop.',
    info: '12101 Mayfield Rd • Open daily early',
    tags: ['breakfast', 'dessert', 'casual'] },

  { id: 'corbo-bakery', title: "Corbo's Dolceria", category: 'food', emoji: '🎂',
    description: 'The other half of the Little Italy bakery rivalry — famous cassata cake, almond paste cookies, espresso bar.',
    info: '12200 Mayfield Rd • Daily • Across from Presti\'s — try both',
    tags: ['dessert', 'iconic'] },

  { id: 'soho-chicken', title: 'Soho Chicken + Whiskey', category: 'food', emoji: '🍗',
    description: 'Nashville hot chicken meets Cleveland — fried bird, biscuits, mac \'n cheese. Whiskey list is no joke.',
    info: '1889 W 25th St (Ohio City) • Lunch & dinner',
    tags: ['lunch', 'dinner', 'group-friendly'] },

  { id: 'b-spot', title: 'B Spot Burgers', category: 'food', emoji: '🍔',
    description: 'Symon\'s casual burger joint — the "Fat Doug" with corned beef and slaw is a must. Multiple locations.',
    info: 'Various locations • Casual • Group-friendly',
    tags: ['lunch', 'casual', 'celebrity-chef'] },

  { id: 'townhall', title: 'TownHall', category: 'food', emoji: '🥗',
    description: 'Massive non-GMO menu in the heart of Ohio City. Huge patio, killer brunch, late-night kitchen. Group-sized booths.',
    info: '1909 W 25th St • Daily, late kitchen • Big group friendly',
    tags: ['brunch', 'dinner', 'group-friendly'] },

  { id: 'lucky-cafe', title: "Lucky's Café", category: 'food', emoji: '🍳',
    description: 'Tremont brunch institution — shrimp & grits, lemon ricotta pancakes, and a line out the door on weekends. Worth the wait.',
    info: '777 Starkweather Ave (Tremont) • Brunch daily',
    tags: ['brunch', 'iconic'] },

  { id: 'blue-door', title: 'The Blue Door Café', category: 'food', emoji: '🥞',
    description: 'Lakewood brunch sleeper hit — French toast with real maple, perfect omelets. Tiny spot, big payoff.',
    info: '1970 Warren Rd, Lakewood • Brunch only • Get there early',
    tags: ['brunch', 'hidden-gem'] },

  { id: 'pier-w', title: 'Pier W', category: 'food', emoji: '🐟',
    description: 'Suspended over Lake Erie with skyline views — old-school seafood spot for a fancy night out. Sunset reservations are gold.',
    info: '12700 Lake Ave (Lakewood) • Dinner • Reservations a must',
    tags: ['date-night', 'special-occasion', 'view'] },

  { id: 'hofbrauhaus', title: 'Hofbräuhaus Cleveland', category: 'food', emoji: '🥨',
    description: 'Munich-style beer hall — liter steins, pretzels the size of your face, communal tables, oompah band. Built for groups.',
    info: '1550 Chester Ave • Daily • Groups welcome • Bavarian energy',
    tags: ['dinner', 'group-friendly', 'rowdy'] },

  { id: 'banter', title: 'Banter Beer & Wine', category: 'food', emoji: '🍟',
    description: 'Belgian-style frites, sausages, and a wild beer list in Detroit Shoreway. Small, cozy, every dish is photogenic.',
    info: '7320 Detroit Ave • Dinner & late • Tight space',
    tags: ['dinner', 'date-night', 'beer-nerd'] },

  { id: 'crop-bistro', title: 'Crop Bistro & Bar', category: 'food', emoji: '🌽',
    description: 'Farm-to-table in a converted bank — drink cocktails inside the literal vault. Wedding reception energy any night.',
    info: '2537 Lorain Ave (Ohio City) • Dinner • Photo-worthy interior',
    tags: ['dinner', 'date-night', 'photogenic'] },

  { id: 'marble-room', title: 'Marble Room', category: 'food', emoji: '🥩',
    description: 'Steaks and sushi in another stunning bank conversion. Soaring ceilings, a literal Greek frieze, very "we got dressed up" night.',
    info: '623 Euclid Ave (Downtown) • Dinner • Reservations',
    tags: ['date-night', 'special-occasion', 'photogenic'] },

  { id: 'felice', title: 'Felice Urban Café', category: 'food', emoji: '🍝',
    description: 'Charming Shaker Square spot in a converted house — Italian-Mediterranean menu, great for a low-key night.',
    info: '12502 Larchmere Blvd • Dinner • Patio in summer',
    tags: ['dinner', 'date-night'] },

  { id: 'beachland', title: 'Beachland Tavern (kitchen)', category: 'food', emoji: '🍔',
    description: 'Music venue with a legitimately good kitchen — burgers and sides before a show. Two stages, gritty Waterloo Arts vibe.',
    info: '15711 Waterloo Rd • Open with shows',
    tags: ['dinner', 'music', 'late'] },

  { id: 'happy-dog', title: 'Happy Dog', category: 'food', emoji: '🌭',
    description: 'A dive bar where you build your own hot dog from 50+ toppings — Froot Loops included. Live music, science lectures, the works.',
    info: '5801 Detroit Ave • Daily, late • Cash for shows',
    tags: ['late', 'weird-fun', 'cheap-eats'] },

  { id: 'honey-hut', title: 'Honey Hut Ice Cream', category: 'food', emoji: '🍯',
    description: 'Old-school neighborhood scoop shop — honey-pecan is the move. A walk-up window classic for a summer night.',
    info: 'Multiple locations • Seasonal',
    tags: ['dessert', 'casual'] },

  { id: 'ninja-city', title: 'Ninja City Kitchen', category: 'food', emoji: '🍜',
    description: 'Asian street-food fusion in Gordon Square — ramen, bao, fried chicken, big group menus. Funky décor, easy crowd-pleaser.',
    info: '6543 Detroit Ave • Dinner • Group-friendly',
    tags: ['dinner', 'group-friendly'] },

  { id: 'saigon-plaza', title: 'Saigon Plaza Vietnamese', category: 'food', emoji: '🥢',
    description: 'AsiaTown pho and banh mi — go on a Sunday morning when the dim-sum-style cart is rolling. Hangover cure for under $15.',
    info: '5400 Detroit Ave • Lunch & dinner • Cheap',
    tags: ['lunch', 'cheap-eats', 'hidden-gem'] },

  // ===== BARS & NIGHTLIFE (22) =====
  { id: 'great-lakes-brewing', title: 'Great Lakes Brewing Co.', category: 'bars', emoji: '🍺',
    description: 'Ohio\'s OG craft brewery — Eliot Ness lager, Christmas Ale, Burning River pale ale. Tour the brewhouse, eat in the historic taproom.',
    info: '2516 Market Ave (Ohio City) • Daily • Tours weekends',
    tags: ['beer', 'tour', 'iconic'] },

  { id: 'platform-beer', title: 'Platform Beer Co.', category: 'bars', emoji: '🍻',
    description: 'Sprawling Ohio City taproom and beer garden — 30+ taps, sour beers, crushable lagers. Massive patio for a group.',
    info: '4125 Lorain Ave • Daily • Patio season is unbeatable',
    tags: ['beer', 'group-friendly', 'patio'] },

  { id: 'market-garden', title: 'Market Garden Brewery', category: 'bars', emoji: '🌭',
    description: 'Right across from West Side Market — beers brewed onsite, a giant patio, and the bratwurst plate. Sunday Funday central.',
    info: '1947 W 25th St • Daily, late • Big group patio',
    tags: ['beer', 'patio', 'group-friendly'] },

  { id: 'forest-city-brewery', title: 'Forest City Brewery', category: 'bars', emoji: '🌲',
    description: 'Tucked into Duck Island with one of the best beer gardens in town — fire pits, picnic tables, lawn games.',
    info: '2135 Columbus Rd • Wed-Sun • Beer garden',
    tags: ['beer', 'patio', 'hidden-gem'] },

  { id: 'saucy-brew', title: 'Saucy Brew Works', category: 'bars', emoji: '🍕',
    description: 'Hingetown brewery with neon signs, brick-oven pizza, and DJ nights. A little flashier than the average Cleveland taproom.',
    info: '2885 Detroit Ave • Daily, late on weekends',
    tags: ['beer', 'dinner', 'late'] },

  { id: 'masthead', title: 'Masthead Brewing', category: 'bars', emoji: '⚓',
    description: 'Downtown brewery in a former Buick dealership — soaring ceilings, killer NEIPAs, a wood-fired pizza oven.',
    info: '1261 Superior Ave • Daily • Walkable downtown',
    tags: ['beer', 'group-friendly'] },

  { id: 'velvet-tango', title: 'The Velvet Tango Room', category: 'bars', emoji: '🥃',
    description: 'Cleveland\'s temple of classic cocktails — dim, jazzy, take-it-seriously craftsmanship. Order the Old Cuban and slow down.',
    info: '2095 Columbus Rd • Tue-Sat evenings • Reserve',
    tags: ['cocktails', 'date-night', 'classy'] },

  { id: 'society-lounge', title: 'Society Lounge', category: 'bars', emoji: '🍸',
    description: 'Hidden basement speakeasy on East 4th — leather banquettes, smoked cocktails, secret-feeling vibe.',
    info: '2063 E 4th St (downstairs) • Evenings • Reserve',
    tags: ['cocktails', 'date-night', 'speakeasy'] },

  { id: 'flying-fig', title: 'Bar Cento / Speakeasy', category: 'bars', emoji: '🍷',
    description: 'Late-night Italian wine and small plates on Market Square — kitchen open until 2am, perfect post-show snack stop.',
    info: '1948 W 25th St • Late kitchen',
    tags: ['late', 'wine', 'cocktails'] },

  { id: 'magic-mountain', title: 'Magic Mountain', category: 'bars', emoji: '🍹',
    description: 'Tiki bar and arcade in Ohio City — flaming bowls for the table, vintage games, kitsch for days. Built for nights you\'ll remember (or not).',
    info: '2667 W 25th St • Evenings, late • 21+',
    tags: ['cocktails', 'late', 'group-friendly', 'photogenic'] },

  { id: 'punch-bowl-social', title: 'Punch Bowl Social', category: 'bars', emoji: '🎳',
    description: 'Bowling, karaoke, ping-pong, shuffleboard, food, and a giant bar — basically a group activity buffet under one roof.',
    info: '1086 W 11th St (Flats) • Evenings • Group-friendly',
    tags: ['games', 'group-friendly', 'rowdy'] },

  { id: 'mahalls', title: "Mahall's 20 Lanes", category: 'bars', emoji: '🎵',
    description: 'Bowling alley + bar + music venue in Lakewood — wood lanes from 1924, a great stage, and a kitchen with pierogi nachos.',
    info: '13200 Madison Ave, Lakewood • Daily, late',
    tags: ['games', 'music', 'late', 'group-friendly'] },

  { id: 'now-thats-class', title: "Now That's Class", category: 'bars', emoji: '🎸',
    description: 'Punk dive on the West Side — cheap beer, weird shows, photo booth, ping-pong. Strictly for the "let\'s see what happens" crowd.',
    info: '11213 Detroit Ave • Late • Cash for shows',
    tags: ['dive', 'late', 'weird-fun'] },

  { id: 'abc-tavern', title: 'ABC Tavern', category: 'bars', emoji: '🍺',
    description: 'Ohio City dive that punches above its weight — strong drinks, strong jukebox, no pretension. A locals\' classic.',
    info: '1872 W 25th St • Late',
    tags: ['dive', 'late', 'cheap-drinks'] },

  { id: 'flannerys', title: "Flannery's Pub", category: 'bars', emoji: '☘️',
    description: 'Old-school Irish pub downtown — Guinness done right, late kitchen, gameday packed. Easy after-Cavs/Guardians stop.',
    info: '323 Prospect Ave • Daily, late',
    tags: ['gameday', 'late', 'group-friendly'] },

  { id: 'flats-east-bank', title: 'Flats East Bank', category: 'bars', emoji: '🌃',
    description: 'Riverside strip of bars, patios, and clubs along the Cuyahoga — go bar-hopping with the lights of the bridges over you.',
    info: 'E Front St / Old River Rd • Best on weekend nights',
    tags: ['bar-crawl', 'late', 'rowdy', 'group-friendly'] },

  { id: 'whiskey-island', title: 'Whiskey Island Still & Eatery', category: 'bars', emoji: '🌅',
    description: 'Lakefront patio bar between Edgewater and Wendy Park — sand volleyball, sunset over the water, casual food.',
    info: '2800 Whiskey Island Dr • Seasonal • Sunsets',
    tags: ['patio', 'lake', 'group-friendly'] },

  { id: 'heinens-rotunda', title: "Heinen's Rotunda Bar", category: 'bars', emoji: '🏛️',
    description: 'Yes — a grocery store with a wine and cocktail bar under a stunning historic stained-glass dome. Only-in-Cleveland flex.',
    info: '900 Euclid Ave • Daytime & evening • Underrated',
    tags: ['cocktails', 'photogenic', 'hidden-gem'] },

  { id: 'beachland-ballroom', title: 'Beachland Ballroom', category: 'bars', emoji: '🎤',
    description: 'Indie/alt music venue with two rooms — check the calendar, you might luck into a national act in a 500-person room.',
    info: '15711 Waterloo Rd • Show nights • Tickets ahead',
    tags: ['music', 'late'] },

  { id: 'grog-shop', title: 'Grog Shop', category: 'bars', emoji: '🎧',
    description: 'Coventry indie/punk venue — small, sweaty, legendary. Where Kid Cudi cut his teeth.',
    info: '2785 Euclid Heights Blvd • Show nights',
    tags: ['music', 'late'] },

  { id: 'bar-hop-east-4th', title: 'East 4th St Bar Hop', category: 'bars', emoji: '🍹',
    description: 'Pedestrian-only block downtown — Lola, Mabel\'s, Society Lounge, Greenhouse Tavern, the works. Easiest bar crawl in the city.',
    info: 'E 4th St • Best Thu-Sat nights',
    tags: ['bar-crawl', 'group-friendly', 'walkable'] },

  { id: 'nano-brew', title: 'Nano Brew', category: 'bars', emoji: '🚲',
    description: 'Casual, bike-friendly Ohio City taproom — burgers, beer flights, indoor/outdoor garage doors that open in summer.',
    info: '1859 W 25th St • Daily',
    tags: ['beer', 'casual', 'patio'] },

  // ===== MUSEUMS & CULTURE (15) =====
  { id: 'rock-hall', title: 'Rock & Roll Hall of Fame', category: 'museums', emoji: '🎸',
    description: 'The reason most people visit Cleveland once. Plan 3-4 hours — the costumes, handwritten lyrics, and basement film theaters are worth it.',
    info: '1100 Rock and Roll Blvd • Daily • $35 • Buy ahead',
    tags: ['iconic', 'must-do', 'rainy-day'] },

  { id: 'cleveland-museum-art', title: 'Cleveland Museum of Art', category: 'museums', emoji: '🖼️',
    description: 'World-class collection — and free admission. Rodin, Picasso, an armor court that looks like a video game. Easy 2-hour visit.',
    info: '11150 East Blvd • Tue-Sun • FREE • University Circle',
    tags: ['free', 'rainy-day', 'iconic'] },

  { id: 'natural-history', title: 'Cleveland Museum of Natural History', category: 'museums', emoji: '🦕',
    description: 'Recently renovated — Lucy the Australopithecus is the showstopper. Planetarium and an outdoor wildlife area too.',
    info: '1 Wade Oval Dr • Daily • $19',
    tags: ['rainy-day', 'family-friendly'] },

  { id: 'great-lakes-science', title: 'Great Lakes Science Center', category: 'museums', emoji: '🚀',
    description: 'Lakefront science museum with an actual NASA Apollo capsule and an Omnimax dome theater. Embrace your inner kid.',
    info: '601 Erieside Ave • Daily • $20',
    tags: ['rainy-day', 'goofy-fun'] },

  { id: 'christmas-story-house', title: 'A Christmas Story House', category: 'museums', emoji: '🦵',
    description: 'The actual house from the 1983 movie — leg lamp, Red Ryder BB gun, soap on the tongue. Walk the tour, then drink at the bar across the street.',
    info: '3159 W 11th St (Tremont) • Daily • $15',
    tags: ['weird-fun', 'iconic', 'photogenic'] },

  { id: 'maltz-museum', title: 'Maltz Museum of Jewish Heritage', category: 'museums', emoji: '🕎',
    description: 'Compact, well-curated museum on the immigrant experience and Jewish-American history — strong special exhibits.',
    info: '2929 Richmond Rd, Beachwood • Tue-Sun • $16',
    tags: ['rainy-day', 'history'] },

  { id: 'uss-cod', title: 'USS Cod Submarine', category: 'museums', emoji: '🚢',
    description: 'WWII fleet sub on the lakefront — squeeze through the hatches and pretend you\'re in Das Boot. Quick visit, big payoff.',
    info: '1201 N Marginal Rd • May-Sep • $15',
    tags: ['weird-fun', 'photogenic', 'history'] },

  { id: 'william-mather', title: 'Steamship William G. Mather', category: 'museums', emoji: '⛴️',
    description: 'Climb aboard a 1925 Great Lakes freighter docked next to the Science Center. Engine room is the move.',
    info: '601 Erieside Ave • Seasonal • Combo with GLSC',
    tags: ['photogenic', 'history'] },

  { id: 'severance-hall', title: 'Severance Hall (Cleveland Orchestra)', category: 'museums', emoji: '🎻',
    description: 'One of the world\'s top 5 orchestras in a stunning Art Deco hall. Even if classical isn\'t your thing, the room itself is a memory.',
    info: '11001 Euclid Ave • Check season schedule • Dress up',
    tags: ['classy', 'date-night', 'iconic'] },

  { id: 'playhouse-square', title: 'Playhouse Square', category: 'museums', emoji: '🎭',
    description: 'Largest performing arts center outside NYC. Touring Broadway shows, comedy, concerts. Stand under the giant outdoor chandelier.',
    info: '1501 Euclid Ave • Check schedule • Photo under the chandelier',
    tags: ['photogenic', 'theater', 'date-night'] },

  { id: 'cinematheque', title: 'Cleveland Cinematheque', category: 'museums', emoji: '🎬',
    description: 'Art-house cinema inside the Cleveland Institute of Art — 35mm prints, repertory programming, the kind of place serious movie people fly to.',
    info: '11610 Euclid Ave • Check schedule • Cheap',
    tags: ['cheap', 'rainy-day', 'date-night'] },

  { id: 'botanical-garden', title: 'Cleveland Botanical Garden', category: 'museums', emoji: '🌿',
    description: 'Indoor rainforest with butterflies, plus 10 acres of outdoor gardens. Combine with the Art Museum for an easy University Circle day.',
    info: '11030 East Blvd • Daily • $15',
    tags: ['photogenic', 'date-night'] },

  { id: 'cultural-gardens', title: 'Cleveland Cultural Gardens', category: 'museums', emoji: '🌍',
    description: 'A free, walkable string of garden-tributes to the city\'s 30+ ethnic groups — tucked along MLK Jr. Drive. Underrated photo walk.',
    info: 'MLK Jr. Dr • Free • Daylight only',
    tags: ['free', 'photogenic', 'walking'] },

  { id: '78th-street-studios', title: '78th Street Studios', category: 'museums', emoji: '🎨',
    description: 'Massive arts complex with 60+ studios and galleries — Third Friday open houses are a great group night out.',
    info: '1300 W 78th St • Best on Third Fridays • Free',
    tags: ['free', 'art', 'date-night'] },

  { id: 'cleveland-public-library', title: 'Cleveland Public Library Main', category: 'museums', emoji: '📚',
    description: 'A surprisingly stunning Beaux-Arts library on Superior — chess collection, atrium, free. Quick stop while walking downtown.',
    info: '325 Superior Ave NE • Mon-Sat • Free',
    tags: ['free', 'photogenic', 'hidden-gem'] },

  // ===== SPORTS, PARKS & OUTDOORS (18) =====
  { id: 'guardians-game', title: 'Cleveland Guardians Game', category: 'sports', emoji: '⚾',
    description: 'Catch a game at Progressive Field — corner-stand stromboli, rooftop bars, fireworks Fridays. Classic American summer night.',
    info: '2401 Ontario St • Apr-Sep • Tickets cheap on weekdays',
    tags: ['gameday', 'group-friendly', 'iconic', 'summer'] },

  { id: 'cavs-game', title: 'Cleveland Cavaliers Game', category: 'sports', emoji: '🏀',
    description: 'Rocket Mortgage FieldHouse — loud, fun, scoreboard-driven. The Q is right next to East 4th, so dinner-then-game is the move.',
    info: '1 Center Ct • Oct-Apr • Tickets vary widely',
    tags: ['gameday', 'group-friendly'] },

  { id: 'browns-game', title: 'Cleveland Browns Game', category: 'sports', emoji: '🏈',
    description: 'Lakefront stadium, Dawg Pound, Muni Lot tailgate culture. Get there 4 hours before kickoff with charcoal and questionable life choices.',
    info: 'Huntington Bank Field • Sep-Jan • Tailgate is the event',
    tags: ['gameday', 'tailgate', 'rowdy', 'iconic'] },

  { id: 'monsters-hockey', title: 'Cleveland Monsters Hockey', category: 'sports', emoji: '🏒',
    description: 'AHL hockey at the Q — way cheaper than NHL, way more rowdy, fights still legal-ish. Affordable group night out.',
    info: '1 Center Ct • Oct-Apr • Tix often <$20',
    tags: ['gameday', 'cheap', 'group-friendly'] },

  { id: 'edgewater-park', title: 'Edgewater Park & Beach', category: 'sports', emoji: '🏖️',
    description: 'Lakefront beach with a skyline backdrop — best spot in the city for a sunset. Rent a kayak, grill at the pavilions, hit Edgewater Live concerts on Thursdays.',
    info: '6500 Cleveland Memorial Shoreway • Free • Summer best',
    tags: ['lake', 'free', 'summer', 'group-friendly', 'photogenic'] },

  { id: 'metroparks-zoo', title: 'Cleveland Metroparks Zoo', category: 'sports', emoji: '🐘',
    description: 'One of the better US zoos — RainForest building, African Elephant Crossing. Easy half-day even for a non-zoo crowd.',
    info: '3900 Wildlife Way • Daily • $20',
    tags: ['family-friendly', 'walking'] },

  { id: 'lake-view-cemetery', title: 'Lake View Cemetery', category: 'sports', emoji: '🌳',
    description: 'Garfield Memorial, Rockefeller\'s grave, and one of the most beautiful arboreal walks in the city. Feels like Pere Lachaise.',
    info: '12316 Euclid Ave • Daily • Free',
    tags: ['free', 'photogenic', 'walking', 'history'] },

  { id: 'wendy-park', title: 'Wendy Park & Whiskey Island', category: 'sports', emoji: '🌅',
    description: 'Sandy beach, lighthouse views, and the new pedestrian bridge connect it to downtown. Great bike or sunset walk.',
    info: '2800 Whiskey Island Dr • Free • Summer',
    tags: ['free', 'lake', 'summer', 'photogenic'] },

  { id: 'goodtime-iii', title: 'Goodtime III Cruise', category: 'sports', emoji: '🚢',
    description: 'Two-hour Lake Erie + Cuyahoga River cruise — bridges, skyline, sunset options. Touristy but actually delivers.',
    info: '825 E 9th St Pier • May-Sep • $25',
    tags: ['lake', 'iconic', 'date-night', 'group-friendly'] },

  { id: 'metroparks-bike-trail', title: 'Lakefront Bikeway', category: 'sports', emoji: '🚴',
    description: 'Rent bikes downtown and ride west along the lake to Edgewater. ~10 miles round-trip, ends with beers on a patio.',
    info: 'Downtown to Edgewater • Bike rental at Lock 3 / Ohio City Bicycle Co-op',
    tags: ['active', 'lake', 'group-friendly'] },

  { id: 'detroit-superior-bridge', title: 'Detroit-Superior Bridge Lower Deck Tour', category: 'sports', emoji: '🌉',
    description: 'Once-a-year-ish public tours of the abandoned subway level under the bridge. Check Cuyahoga County calendars — wildly cool.',
    info: 'Detroit-Superior Bridge • Special events only',
    tags: ['hidden-gem', 'photogenic', 'history'] },

  { id: 'public-square', title: 'Public Square', category: 'sports', emoji: '⛲',
    description: 'Reimagined heart of downtown — fountains in summer, ice rink in winter. Free, lively, easy meet-up spot.',
    info: 'Downtown • Free • Year-round',
    tags: ['free', 'walking', 'downtown'] },

  { id: 'edgewater-live', title: 'Edgewater Live (Thursdays)', category: 'sports', emoji: '🎶',
    description: 'Free concerts on the beach Thursday nights in summer — food trucks, sunsets, beer tent. Easiest "Cleveland is great" night.',
    info: 'Edgewater Park • Thu nights, summer • Free',
    tags: ['free', 'summer', 'lake', 'group-friendly', 'music'] },

  { id: 'flats-river-bike', title: 'Cuyahoga River Walk', category: 'sports', emoji: '🚶',
    description: 'New riverwalk along the Flats — old shipyard cranes, freight bridges, riverside bars. Photographers\' dream at golden hour.',
    info: 'Flats East Bank to Settlers Landing',
    tags: ['walking', 'free', 'photogenic'] },

  { id: 'cleveland-skyline-shot', title: 'Skyline Photo at Edgewater Pier', category: 'sports', emoji: '📸',
    description: 'The classic Cleveland skyline shot — the entire downtown framed by lake on one side, beach on the other. Group photo gold.',
    info: 'Edgewater Park east end • Free • Sunset best',
    tags: ['free', 'photogenic', 'iconic'] },

  { id: 'mentor-headlands', title: 'Mentor Headlands Beach', category: 'sports', emoji: '🏝️',
    description: 'Longest natural beach in Ohio — 30 min east of downtown. Lighthouse, dunes, way less crowded than Edgewater.',
    info: '9601 Headlands Rd, Mentor • Free',
    tags: ['lake', 'free', 'summer', 'day-trip'] },

  { id: 'metroparks-rocky-river', title: 'Rocky River Reservation', category: 'sports', emoji: '🌳',
    description: 'Cleveland Metroparks gem — shale cliffs, riding stables, 13 miles of trails. Easy nature break without leaving town.',
    info: 'I-480 to Valley Pkwy • Free',
    tags: ['free', 'active', 'walking'] },

  { id: 'cleveland-thunderbolts', title: 'Indoor Sky Diving (iFLY)', category: 'sports', emoji: '🪂',
    description: 'Wind-tunnel skydiving in Brooklyn — 60 seconds of flying, hilarious group video. Great pre-dinner activity.',
    info: '6000 Engle Rd • Daily • ~$80/person',
    tags: ['active', 'group-friendly', 'rainy-day', 'memorable'] },

  // ===== NEARBY / DAY TRIPS (22) =====
  { id: 'cedar-point', title: 'Cedar Point', category: 'nearby', emoji: '🎢',
    description: '"Roller coaster capital of the world" — 17 coasters including Steel Vengeance, Millennium Force, Maverick. Allocate a full day, wear sunscreen, eat at the Famous Dave\'s.',
    info: 'Sandusky • ~1 hr west • $80+ • Full day trip',
    tags: ['day-trip', 'group-friendly', 'iconic', 'memorable', 'summer'] },

  { id: 'kalahari', title: 'Kalahari Resort & Waterpark', category: 'nearby', emoji: '🌊',
    description: 'America\'s largest indoor waterpark — body slides, lazy river, swim-up bar. Stay overnight or just buy a day pass. Group rooms have 6+ beds.',
    info: 'Sandusky • ~1 hr • Day pass $80+ • Lodging available',
    tags: ['day-trip', 'group-friendly', 'overnight', 'rainy-day'] },

  { id: 'castaway-bay', title: 'Castaway Bay', category: 'nearby', emoji: '💦',
    description: 'Cedar Fair\'s smaller indoor waterpark — cheaper than Kalahari, often has package deals with Cedar Point.',
    info: 'Sandusky • ~1 hr • $50 day pass',
    tags: ['day-trip', 'rainy-day', 'group-friendly'] },

  { id: 'put-in-bay', title: 'Put-in-Bay (South Bass Island)', category: 'nearby', emoji: '🏝️',
    description: 'Lake Erie party island — golf carts, dueling pianos at the Beer Barrel Saloon (longest bar in the world), Perry\'s Monument. Catch the Jet Express ferry.',
    info: 'Jet Express from Port Clinton • $40 RT • Summer only',
    tags: ['day-trip', 'overnight', 'group-friendly', 'rowdy', 'summer', 'memorable'] },

  { id: 'kelleys-island', title: 'Kelleys Island', category: 'nearby', emoji: '🚲',
    description: 'Quieter sister to Put-in-Bay — bike the perimeter, swim at the state park, see the Glacial Grooves. Great chill day.',
    info: 'Kelleys Island Ferry from Marblehead • Summer • Bring bikes',
    tags: ['day-trip', 'lake', 'summer', 'active'] },

  { id: 'marblehead-lighthouse', title: 'Marblehead Lighthouse', category: 'nearby', emoji: '🗼',
    description: 'Oldest continuously operating lighthouse on the Great Lakes — climb to the top for $3, picnic on the rocks. Stop on the way to/from Put-in-Bay.',
    info: '110 Lighthouse Dr, Marblehead • $3 climb • Summer',
    tags: ['day-trip', 'photogenic', 'cheap', 'lake'] },

  { id: 'african-safari', title: 'African Safari Wildlife Park', category: 'nearby', emoji: '🦒',
    description: 'Drive-through park where giraffes stick their heads in your car. Yes, really. Buy the bucket of carrots. Hilarious group memory.',
    info: '267 Lightner Rd, Port Clinton • $25/person • Summer',
    tags: ['day-trip', 'weird-fun', 'group-friendly', 'memorable'] },

  { id: 'cuyahoga-valley-np', title: 'Cuyahoga Valley National Park', category: 'nearby', emoji: '🏞️',
    description: 'America\'s least-known NP and it\'s 30 min from downtown. Brandywine Falls, Towpath Trail, the scenic railroad. Easy half-day in nature.',
    info: 'I-271 south • Free • Year-round',
    tags: ['day-trip', 'free', 'active', 'iconic'] },

  { id: 'brandywine-falls', title: 'Brandywine Falls', category: 'nearby', emoji: '💧',
    description: '60-foot waterfall in Cuyahoga Valley — boardwalk leads right to the base. 20-minute walk, infinite group photos.',
    info: 'Brandywine Rd, Sagamore Hills • Free • Year-round',
    tags: ['day-trip', 'free', 'photogenic', 'walking'] },

  { id: 'blue-hen-falls', title: 'Blue Hen Falls', category: 'nearby', emoji: '🥾',
    description: 'Smaller, secret-feeling waterfall in CVNP — 1-mile out-and-back hike. Fewer crowds than Brandywine.',
    info: 'CVNP • Free • Hiking shoes',
    tags: ['day-trip', 'free', 'active', 'hidden-gem'] },

  { id: 'cv-railroad', title: 'Cuyahoga Valley Scenic Railroad', category: 'nearby', emoji: '🚂',
    description: 'Vintage train through the national park — wine-tasting cars, beer cars, classic excursion. Way better with a buzz on the Bourbon Express.',
    info: 'Multiple stations • $20-50 • Themed rides',
    tags: ['day-trip', 'group-friendly', 'memorable'] },

  { id: 'stan-hywet', title: 'Stan Hywet Hall (Akron)', category: 'nearby', emoji: '🏰',
    description: 'Goodyear founder\'s 65-room manor — tour the house and 70 acres of gardens. Christmas lights season is unreal.',
    info: '714 N Portage Path, Akron • $20 • ~45 min south',
    tags: ['day-trip', 'photogenic', 'history'] },

  { id: 'akron-zoo', title: 'Akron Zoo', category: 'nearby', emoji: '🐒',
    description: 'Smaller, walkable zoo — easier than Cleveland Metroparks for a 2-hour visit. Pair with Stan Hywet for a perfect Akron day.',
    info: '500 Edgewood Ave, Akron • $15',
    tags: ['day-trip', 'family-friendly', 'walking'] },

  { id: 'geneva-on-the-lake', title: 'Geneva-on-the-Lake', category: 'nearby', emoji: '🍷',
    description: 'Ohio\'s oldest summer resort strip — bumper cars, mini-golf, fudge, dive bars. Add wineries (Ferrante, Debonné) for a full day.',
    info: '~1 hr east • Summer best • Group rentals available',
    tags: ['day-trip', 'overnight', 'summer', 'group-friendly', 'memorable'] },

  { id: 'ferrante-winery', title: 'Ferrante Winery', category: 'nearby', emoji: '🍇',
    description: 'Geneva wine country — Italian-style winery with patio dining, ice wine flights, live music. Easy group reservation.',
    info: '5585 OH-307, Geneva • Daily • Tasting flights',
    tags: ['day-trip', 'group-friendly', 'wine'] },

  { id: 'debonne-vineyards', title: 'Debonné Vineyards', category: 'nearby', emoji: '🍾',
    description: 'Largest estate winery in Ohio — outdoor concerts, big patio, food. Pair with Ferrante for a wine-trail afternoon.',
    info: '7840 Doty Rd, Madison • Daily • Patio season',
    tags: ['day-trip', 'group-friendly', 'wine', 'patio'] },

  { id: 'holden-arboretum', title: 'Holden Arboretum', category: 'nearby', emoji: '🌲',
    description: '3,500 acres east of the city — the Murch Canopy Walk and Emergent Tower put you in the treetops. Great fall-foliage trip.',
    info: '9550 Sperry Rd, Kirtland • $20 • Fall best',
    tags: ['day-trip', 'photogenic', 'active'] },

  { id: 'conneaut-beach', title: 'Conneaut Township Park Beach', category: 'nearby', emoji: '🌊',
    description: 'Easternmost lake beach in Ohio — wide sand, cliffs, fewer people. Combine with the Conneaut WWII reenactment in August (D-Day Ohio).',
    info: '480 Lake Rd, Conneaut • Free',
    tags: ['day-trip', 'lake', 'free', 'summer'] },

  { id: 'd-day-ohio', title: 'D-Day Conneaut (August)', category: 'nearby', emoji: '🪖',
    description: 'Largest WWII reenactment in the country — landings, encampments, period jazz dance. Wild, weird, unforgettable summer-only event.',
    info: 'Conneaut Township Park • Mid-August only',
    tags: ['day-trip', 'weird-fun', 'memorable', 'summer'] },

  { id: 'hocking-hills', title: 'Hocking Hills (long drive)', category: 'nearby', emoji: '🌲',
    description: 'Cliffs, gorges, waterfalls — Old Man\'s Cave, Ash Cave, Cedar Falls. A solid 2.5 hours, but it\'s the most scenic place in Ohio.',
    info: 'Logan, OH • ~2.5 hrs • Worth a sleepover',
    tags: ['day-trip', 'overnight', 'active', 'memorable'] },

  { id: 'sandusky-bay-cruise', title: 'Sandusky Bay Sunset Cruise', category: 'nearby', emoji: '🛥️',
    description: 'Casual evening cruise out of Sandusky — drinks, sunset, no pretense. Cheaper than the Cleveland version and you\'re already nearby.',
    info: 'Sandusky • Summer • Various operators',
    tags: ['day-trip', 'lake', 'summer', 'group-friendly'] },

  { id: 'lake-erie-charter-fishing', title: 'Lake Erie Walleye Charter', category: 'nearby', emoji: '🎣',
    description: 'Half-day walleye fishing charter out of Port Clinton — 6-person boats, all gear included, fish cleaned at the dock. Memorable group activity.',
    info: 'Port Clinton • $400-600/boat • Apr-Oct',
    tags: ['day-trip', 'group-friendly', 'memorable', 'active'] },

  // ===== GOLF (10) =====
  { id: 'topgolf-cleveland', title: 'Topgolf Independence', category: 'golf', emoji: '🎯',
    description: 'Drive your buddies\' egos into the dirt at Topgolf. Three levels of bays, food, drinks, music — works for golfers and non-golfers alike.',
    info: '5820 Rockside Woods Blvd N • Daily, late • Bays $40-60/hr',
    tags: ['games', 'group-friendly', 'rainy-day', 'memorable'] },

  { id: 'five-iron', title: 'Five Iron Golf (Downtown)', category: 'golf', emoji: '🏌️',
    description: 'Indoor golf simulators downtown — play Pebble Beach in the city. Bar, food, leagues. Best when the weather sucks.',
    info: '925 Euclid Ave • Daily, late • Simulator + bar',
    tags: ['games', 'group-friendly', 'rainy-day', 'late'] },

  { id: 'sleepy-hollow', title: 'Sleepy Hollow Golf Course', category: 'golf', emoji: '⛳',
    description: 'One of the best public courses in the country — Stanley Thompson design in the Metroparks, $50ish for non-residents. Walkable.',
    info: '9445 Brecksville Rd • Tee times required • Public',
    tags: ['serious-golf', 'public'] },

  { id: 'manakiki', title: 'Manakiki Golf Course', category: 'golf', emoji: '🌳',
    description: 'Donald Ross design east of Cleveland — a public-course bargain on a true classic layout. Tight greens, big trees.',
    info: '35501 Eddy Rd, Willoughby Hills • Public',
    tags: ['serious-golf', 'public'] },

  { id: 'sweetbriar', title: 'Sweetbriar Golf Club', category: 'golf', emoji: '🌷',
    description: 'Walkable Avon Lake club with two 9s, restaurant, and a beer-cart culture. Casual group-round friendly.',
    info: '750 Jaycox Rd, Avon Lake',
    tags: ['public', 'group-friendly'] },

  { id: 'big-met', title: 'Big Met Golf Course', category: 'golf', emoji: '🦅',
    description: 'The most popular Metroparks course — long, flat, forgiving for the casual hacker in your group.',
    info: '4811 Valley Pkwy, Fairview Park • Public',
    tags: ['public', 'casual-golf', 'group-friendly'] },

  { id: 'mastick-woods', title: 'Mastick Woods (par-3)', category: 'golf', emoji: '🪵',
    description: 'Short par-3 course in the Metroparks — perfect for beginners, walking 9, or a quick group warm-up.',
    info: '19900 Puritas Ave • Cheap • Walkable',
    tags: ['cheap', 'casual-golf', 'group-friendly'] },

  { id: 'flying-saucer-mini-golf', title: 'Flying Saucer Mini Golf', category: 'golf', emoji: '🛸',
    description: 'Black-light, glow-in-the-dark indoor mini golf in Lakewood — bring drinks, lower the stakes, raise the laughs.',
    info: 'Lakewood • Indoor • All ages',
    tags: ['games', 'group-friendly', 'rainy-day', 'goofy-fun'] },

  { id: 'castaway-cove-mini', title: 'Castaway Cove Mini Golf', category: 'golf', emoji: '🏴‍☠️',
    description: 'Pirate-themed outdoor mini golf in North Olmsted — 18 holes, ice cream stand, peak summer cheese.',
    info: 'North Olmsted • Seasonal • Cheap',
    tags: ['games', 'group-friendly', 'summer', 'goofy-fun'] },

  { id: 'sand-ridge', title: 'Sand Ridge Golf Club (splurge)', category: 'golf', emoji: '🏆',
    description: 'Top-100 modern course east of town — Tom Fazio design, immaculate. Expensive guest fee but a once-a-trip splurge.',
    info: 'Chardon, OH • Guest play only • $$$',
    tags: ['serious-golf', 'special-occasion', 'splurge'] }
];

// Sanity log when this file loads
if (typeof window !== 'undefined') {
  window.ACTIVITIES = ACTIVITIES;
  window.CATEGORIES = CATEGORIES;
  console.log(`Loaded ${ACTIVITIES.length} activities`);
}
