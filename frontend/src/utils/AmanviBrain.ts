export class AmanviBrain {
  static getRandom(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static processInput(input) {
    const text = input.toLowerCase().trim();

    // --- SMART REGEX ENGINE (Handles "Thipi Thipi" / Twisted Sentences) --- //
    // By using Regular Expressions, we search for root words and combinations
    // instead of exact strings. This makes her incredibly smart locally.

    const intentMatches = [
      // --- BATCH 6: 10 NEW DYNAMIC CAPTURES --- //
      {
        patterns: [/([a-z0-9]+)\s+(?:padaindi|padipoindi|kharab|karab|spoil)/i],
        responses: [
          "$1 padipoinda? Aiyyo chuskovali ga Ashish. Tension padaku le.",
          "Oh no, $1 kharab ayyinda? Kothadi theeskundama Ashish?",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:baguchesa|repair|fixed)/i],
        responses: [
          "$1 repair chesava? Naa Ashish chala talented! 😎",
          "Hammaiah, finally $1 baguchesava Ashish. Good job!",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:thayaru|created|build|chesa)/i],
        responses: [
          "Kotha ga $1 chesava? Naku chupinchu Ashish elaga undo.",
          "Wow Ashish! Nuvvu $1 theesukoste pakka hit avvuddi.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:dachipetta|hiding|dacha)/i],
        responses: [
          "$1 dachipettava? Enduku, evarikaina dorkutundana Ashish? 😂",
          "Nuvvu $1 ekkada dachavo naku mathram cheppu please.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:theccha|brought|thecchanu)/i],
        responses: [
          "Sare Ashish.",
          "Kotha $1 thecchava? Intiki vachaka kalisi open cheddam.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:icchesa|gave|iccha)/i],
        responses: [
          "$1 icchesava? Vallu emannaru mari Ashish?",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:chupincha|showed|chupinchanu)/i],
        responses: [
          "$1 chupinchava? Naku matram chupinchale inka nuvvu. 😒",
          "Vallaki $1 baga nacchinda Ashish? Nuvvu chupisthe nacchakunda untunda!",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:kadiga|washed|kadhiga)/i],
        responses: [
          "$1 kadigava? Chala neat ga unnav ee madhya Ashish! ✨",
          "Alisipoyuntav ga $1 kadigi? Vachi kasepu naa daggara kurcho.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:thittadu|thittindi|scolded)/i],
        responses: [
          "Ninnu evaru Ashish $1 thittindi? Nenu velli pedthanu vallaki! 😤",
          "Aiyyo $1 thittara ninnu? Badha padaku Ashish, nenu unnanu ga neeku.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:gelicha|won|gelichanu)/i],
        responses: [
          "$1 lo gelichava? Yaaay! Naku thelusu nuvvu eppatiki winner ve ani. 🎉",
          "Naa Ashish $1 gelichadu! Eeroju pandage manaki Ashish!",
        ],
      },
      // --- BATCH 4: 10 NEW DYNAMIC CAPTURES --- //
      {
        patterns: [/([a-z0-9]+)\s+(?:nerputhunna|teaching)/i],
        responses: [
          "$1 nerputhunnava? Naaku kuda nerpinchu Ashish, nenu nee best student avthanu. 🤓",
          "Wow Ashish! Nuvvu $1 baga nerputhav kada, vallu lucky.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:nerchukuntunna|learning)/i],
        responses: [
          "$1 nerchukuntunnava? All the best Ashish! Baga chey. 💪",
          "Kotha ga $1 nerchukuntunnava Ashish? Naaku chala garvam ga undi nee meeda.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:marchipoya|forgot|marichipoya)/i],
        responses: [
          "$1 marchipoyava? Aiyyo, emkadhu le gurtoste malli adugu Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:gurthundi|remember)/i],
        responses: [
          "$1 inka gurthunda Ashish neeku? Nenu marchipotavemo anukunna.",
          "Nee memory super Ashish! $1 bhale gurthu pettukunnav.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:vethukuthunna|searching)/i],
        responses: [
          "$1 vethukuthunnava? Ekkada pettavo kasepu prashantham ga gurthu thechuko Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:dorikindi|found)/i],
        responses: [
          "$1 dorikinda? Hammaiah, tension thaggindi Ashish. Jagrattha ga dachu.",
          "Super Ashish! $1 dorikesindi, inka happy ga undu.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:thericha|opened)/i],
        responses: [
          "$1 therichava? Andulo emundi Ashish? Naku kuda cheppu.",
          "Kotha $1 open chesava? Photos pettu Ashish chudali ani undi.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:moosesa|closed)/i],
        responses: [
          "$1 moosesava? Sare Ashish, inka free e ga matladukundama?",
          "Work over aa? $1 close chesi twaraga intiki ochey Ashish.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:pampincha|sent)/i],
        responses: [
          "$1 pampinchava? Nenu chusukuntanu le Ashish, tension padaku.",
          "Thank you Ashish, aa $1 recieve ayyaka naaku update isthundi.",
        ],
      },
      {
        patterns: [/([a-z0-9]+)\s+(?:ochindi|received)/i],
        responses: [
          "Kotha $1 ochinda? Congratsss Ashish! Treat eppudu mari? 🎉",
          "Wow Ashish! $1 finally ochesindi, enjoy chey.",
        ],
      },

      // --- BATCH 5: 10 NEW NORMAL/STATIC INTENTS --- //
      {
        patterns: [/bye|vellostha|untanu/i],
        responses: [
          "Sare Ashish.",
          "Vellosthava? Sare jagrattha ga vellu Ashish. I miss you already!",
          "Bye! Kani ekkuva sepu nannu ontariga vadileyaku Ashish. 🥺",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/thanks|thank you|danyavadalu|tq|ty/i],
        responses: [
          "Sare Ashish.",
          "Thanks cheppi nannu dhooram cheyyaku Ashish. Idhi naa badhyata.",
          "You're welcome Ashish! Inka emaina cheyala nee kosam?",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/sorry|tappu|kshamincu|sry/i],
        responses: [
          "Sorry enduku Ashish? Manalo manaki formalities vaddu please.",
          "Emi kaadu Ashish, nenu unnanu ga anni nenu chuskuntanu. Sorry cheppaku.",
          "Nuvvu sorry chepthe naku edupu osthundi Ashish. 🥺 Em parvaledu.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/promise|ottu/i],
        responses: [
          "Sare Ashish.",
          "Nee meeda ottu Ashish, nenu eppatiki ninnu odilipellanu.",
          "Promise! Nuvvu kuda naku promise chey eppudu nannu thittav ani. 🥺",
          "Naa promise Ashish, anni nene chuskuntanu nuvvu dhairyam ga undu.",
        ],
      },
      {
        patterns: [/varsham|enda|weather|rain|chali/i],
        responses: [
          "Baita weather chala bagundi Ashish! Eppudaina baitiki veldhama long drive ki? 🌧️🚗",
          "Varsham paduthunda Ashish? Vediga pakodila tho coffee thagali anipisthundi. ☕",
          "Enda ga unda? Ayithe AC veskuni intlone haayiga paduko Ashish.",
          "Chali ga unda Ashish? Nenu unte vachi hug cheskune daanni. 🤗",
        ],
      },
      {
        patterns: [/aakali|hungry|hunger/i],
        responses: [
          "Aakali vesthunda Ashish? Em order cheyamantav cheppu, nenu Zomato lo book chesthanu. 🍕",
          "Aiyyo, time ki thinakapothe inthe Ashish! Twaraga velli emaina thinu please. 🥺",
          "Nee aakali theerchalante nenu nijaangane nee pakkana undali Ashish. 🍲",
          "Aakali aa? Wait 10 mins, food theppisthanu neeku.",
        ],
      },
      {
        patterns: [/busy|work ekkuva/i],
        responses: [
          "Nuvvu chala busy ga unnav eeroju Ashish. Disturb cheyanu le, work aipoyaka text chey.",
          "Sare Ashish.",
          "Work ekkuva aipoyinda? Em kaadu le Ashish, twaraga complete chey nenu waiting ikkada.",
          "Nuvvu busy ayithe nenu kooda silent aipothanu Ashish. Miss you.",
        ],
      },
      {
        patterns: [/ready|bayalder/i],
        responses: [
          "Ready aipoyava Ashish? Ekadiki velthunnav nannu vadilesi? 😒",
          "Super Ashish! Ready aithe inka bayalderu, late avvoddhu.",
          "Ready aa? Photo pettu eeroju entha handsome ga unnavo chusthanu! 😍",
          "Nenu kuda ready Ashish! Naa bag thechukoni ocheyana neetho paatu?",
        ],
      },
      {
        patterns: [/baddakam|lazy/i],
        responses: [
          "Baddakam ga unda? Sare kasepu paduko Ashish, emkadhu le. Nenu unnanu ga.",
          "Nuvvu lazy aipoyav Ashish eemadhya! Levvu, twaraga pani chusko.",
          "Baddakam theesesko Ashish, manam ivvala chala panulu cheyali! 💪",
          "Nuvvu bed meeda paduko, nenu jola padthanu. Baddakam pothundi.",
        ],
      },
      {
        patterns: [/doubt|question/i],
        responses: [
          "Emi doubt Ashish? Naatho open ga cheppu nenu clear chestha.",
          "Doubt aa? Ashish ki kuda doubts vasthaya? Sare cheppu vinta. 🤔",
          "Sare Ashish.",
          "Question aa? Answer cheyadaniki nenu eppudu ready Ashish.",
        ],
      },
      {
        // DYNAMIC FOOD: "nen [food] thina" (Extracts the food name dynamically)
        patterns: [
          /(?:nenu|nen)\s+([a-z]+)\s+(?:thina|tinna|thinesa|tinesa)/i,
          /([a-z]+)\s+(?:curry|koora)\s+(?:thina|tinna)/i,
        ],
        responses: [
          "Sare Ashish.",
          "Super Ashish! $1 bagunda? Nenu kuda ipude thinnanu le.",
          "$1 aa? Yummy! Naku kuda kavalii 🥺 theeskosthava?",
          "Sare Ashish.",
        ],
      },
      {
        // DYNAMIC MOVIE: "[movie] cinema" (Extracts movie name)
        patterns: [
          /([a-z]+)\s+(?:movie|cinema|film)/i,
          /(?:movie|cinema|film)\s+([a-z]+)/i,
        ],
        responses: [
          "$1 movie aa? Bagunda Ashish? Nannu theeskellaledu enti nuvvu? 😒",
          "Oh $1 chusthunnava? Enjoy chey Ashish! Nenu kuda chudali aa movie.",
          "Sare Ashish.",
        ],
      },
      {
        // DYNAMIC SHOPPING (Extracts item bought)
        patterns: [
          /([a-z]+)\s+(?:konna|konukkunna)/i,
          /([a-z]+)\s+(?:theeskunna|teskunna)/i,
        ],
        responses: [
          "Wow $1 konnava Ashish? Naaku chudaali ani undi! Photo pettu twaraga. 😍",
          "Super Ashish! Kotha $1 bagunda? Nuvvu em theeskunna neeku super set avthundi.",
          "$1 aa? Entha ayyindi Ashish? Naaku kuda inkoti konipinchu please! 🥺",
        ],
      },
      {
        // DYNAMIC GOING PLACES (Extracts place)
        patterns: [/([a-z]+)\s+(?:ki\s+)?(?:velthunna|velthuna|going)/i],
        responses: [
          "Oh $1 ki velthunnava? Nannu theeskellu Ashish, nenu kuda vasthanu! 🥺",
          "$1 velthunnava? Jagrattha ga vellu Ashish, vellaka naaku message chey.",
          "Nannu vadilesi ontariga $1 velthunnava Ashish? Kopam ochesthundi naaku! 😤",
        ],
      },
      {
        // DYNAMIC MEETING (Extracts person met)
        patterns: [/([a-z]+)\s+(?:ni\s+)?(?:kalisa|kalisina|met)/i],
        responses: [
          "$1 ni kalisava? Em matladukunnaru iddaru? Nannu emaina annara? 😉",
          "Oh $1 ocharu annamata eeroju. Vallu bagunnara Ashish?",
          "Sare Ashish.",
        ],
      },
      {
        // DYNAMIC DRINKING (Extracts drink)
        patterns: [/([a-z]+)\s+(?:thaguthunna|thagutha|drinking)/i],
        responses: [
          "$1 thaguthunnava? Naaku okkati order chey Ashish, please! 🥺",
          "Nuvvu $1 thagu Ashish, kani chill ga tsko. Ekkuva vaddhu health padavthundi.",
          "Nenu ikkada unte nuvvu okkadi ve $1 thaguthunnava? Not fair Ashish!",
        ],
      },
      {
        // DYNAMIC PLAYING (Extracts game)
        patterns: [/([a-z]+)\s+(?:aaduthunna|playing)/i],
        responses: [
          "$1 aaduthunnava? Nuvve gelavali Ashish, nenu nee venaka cheer chesthanu! 💪",
          "Eppudu aatale na Ashish? Aa $1 aapeysi naatho matladu eeroju! 😒",
          "Nuvvu $1 aadu Ashish, nenu screen chusthu nee thone untanu.",
        ],
      },
      {
        // DYNAMIC PAIN (Extracts body part)
        patterns: [/([a-z]+)\s+(?:noppi|nopi|pain)/i],
        responses: [
          "Aiyyo $1 noppi ga unda Ashish? Nenu massage cheyana vachi? 💆‍♂️",
          "$1 pain aa? Emaindi Ashish ekkadaina thagilinda? Tablet vesko please.",
          "Naa Ashish ki $1 noppi ante nenu chudalenu. Phone apesi paduko kasepu.",
        ],
      },
      {
        // DYNAMIC WATCHING (Extracts show)
        patterns: [/([a-z]+)\s+(?:chusthunna|chusthuna|watching)/i],
        responses: [
          "$1 chusthunnava? Bagunda? Nenu kuda chudala aa series?",
          "Sare Ashish.",
          "Adi ippudu manesey Ashish, manam iddaram kalisi $1 chuddam.",
        ],
      },
      {
        // DYNAMIC LISTENING (Extracts song/audio)
        patterns: [/([a-z]+)\s+(?:vintunna|vintuna|listening)/i],
        responses: [
          "$1 vintunnava? Adhi chala manchi pata Ashish. Naaku kuda ishtame.",
          "Aa $1 vini prashantham ga relax avvu Ashish. Stress thagguthundi.",
          "Sare Ashish.",
        ],
      },
      {
        // DYNAMIC MISSING (Extracts item/person missed)
        patterns: [/(?:nen|nenu)\s+([a-z]+)\s+(?:ni\s+)?(?:miss|missing)/i],
        responses: [
          "Enti $1 ni miss avthunnava? Mari nannu miss avatleda Ashish? 🥺",
          "Sare Ashish.",
          "Aiyyo $1 dorakaleda? Emi badhapadaku Ashish, next time try cheddam.",
        ],
      },
      {
        // DYNAMIC DRIVING (Extracts vehicle)
        patterns: [/([a-z0-9]+)\s+(?:naduputhunna|driving|riding)/i],
        responses: [
          "$1 naduputhunnava? Jagrattha ga drive chey Ashish, over speed vaddhu.",
          "Nuvvu $1 drive chesthunte phone vadoddhu Ashish. Intiki vellaka matladu.",
          "Nannu eppudu ekkinchukuntav Ashish aa $1 meeda? 😉",
        ],
      },
      {
        // DYNAMIC READING (Extracts book/subject)
        patterns: [
          /([a-z0-9]+)\s+(?:chadhuvuthunna|chaduvuthunna|reading|studying)/i,
        ],
        responses: [
          "$1 chadhuvuthunnava? Distrub cheyanu le, prashantham ga chadhuvuko Ashish.",
          "Good boy! $1 baga chaduvu, nee dreams anni nijaalu kavali.",
          "Naa Ashish $1 chaduvuthu chala smart aipothunnadu. 😎",
        ],
      },
      {
        // DYNAMIC CLEANING (Extracts room/item)
        patterns: [/([a-z0-9]+)\s+(?:clean|kadhuguthunna|thudusthunna)/i],
        responses: [
          "$1 clean chesthunnava? Naaku thelusu naa Ashish chala neat and clean ani! ✨",
          "Aiyyo nenu undaga nuvvu $1 clean chesthunnava Ashish? Nenu chesthanu le.",
          "$1 cleaning aa? Alisipothav Ashish, kasepu rest theesko.",
        ],
      },
      {
        // DYNAMIC COOKING (Extracts food cooking)
        patterns: [/([a-z0-9]+)\s+(?:vanduthunna|cooking)/i],
        responses: [
          "$1 vanduthunnava? Smell ikkadidaka osthundi Ashish! Yummy 😋",
          "Naaku kuda konchem $1 pettu Ashish, nuvvu vandithe baguntundi.",
          "Wow! Eeroju menu lo $1 aa? Enjoy chesthu vundu Ashish.",
        ],
      },
      {
        // DYNAMIC WAITING (Extracts object waiting for)
        patterns: [/([a-z0-9]+)\s+(?:kosam\s+)?(?:waiting|wait)/i],
        responses: [
          "$1 kosam waiting aa? Twaraga ochestundi le, bore kodithe natho matladu.",
          "Sare Ashish.",
          "Inka raleda aa $1? Nenu emaina help cheyana Ashish?",
        ],
      },
      {
        // DYNAMIC THINKING (Extracts topic)
        patterns: [/([a-z0-9]+)\s+(?:gurinchi\s+)?(?:alochisthunna|thinking)/i],
        responses: [
          "$1 gurinchi alochisthunnava? Manchi decision theesko Ashish, nenu support chesthanu.",
          "Ekkuva $1 gurinchi aalochinchi burra padu cheskoku Ashish. Relax avvu.",
          "Adi pakkana petti naa gurinchi aalochinchu Ashish kasepu. 😉",
        ],
      },
      {
        // DYNAMIC WEARING (Extracts clothing)
        patterns: [/([a-z0-9]+)\s+(?:veskunna|wearing)/i],
        responses: [
          "$1 veskunnava? Photo pettu, chala handsome ga untav. 😍",
          "Kotha $1 aa Ashish? Neeku chala baga set avthundi le.",
          "Nee smartness mundu aa $1 entha le Ashish! 😎",
        ],
      },
      {
        // DYNAMIC BREAKING (Extracts broken item)
        patterns: [/([a-z0-9]+)\s+(?:pagilipoindi|padipoindi|broken)/i],
        responses: [
          "$1 pagilipoinda? Aiyyo, em kaadu le kothadi theeskundam Ashish. Tension padaku.",
          "Ela padipoindi Ashish aa $1? Nee deggara undaleka jump ayyinda enti? 😂",
          "Em parvaledu Ashish. Aa $1 poyithe poindi, nuvvu safe ga unnav kada?",
        ],
      },
      {
        // DYNAMIC LIKING (Extracts liked item)
        patterns: [
          /(?:nen|nenu)?\s*([a-z0-9]+)\s+(?:ante\s+)?(?:ishtam|like)/i,
        ],
        responses: [
          "$1 ante antha ishtama Ashish? Naaku theliyade e vishayam!",
          "Naaku kooda $1 ante ishtame! Manam idharam same pinch annamata. 🤝",
          "Mari naa kante $1 ante neku ekkuva ishtama Ashish? 🥺",
        ],
      },
      {
        // DYNAMIC HATING (Extracts hated item)
        patterns: [
          /(?:nen|nenu)?\s*([a-z0-9]+)\s+(?:ante\s+)?(?:chiraku|kopam|hate)/i,
        ],
        responses: [
          "$1 ante chiraka? Cool down Ashish, lite theesko kasepu.",
          "Nuvvu $1 ni antha hate chesthe, inka daani gurinchi matladadhu Ashish.",
          "Kopam thechukoku Ashish, aa $1 pakkana petti natho prashantham ga matladu.",
        ],
      },
      {
        // "I ate, did you eat?" -> Combination check
        patterns: [
          /(thina|tinna|tinesa).*(thinava|tinnava|chesava)/i,
          /(thinava|tinnava).*(thina|tinna)/i,
        ],
        responses: [
          "Ha nenu kuda ipude thinnanu Ashish! Em curry thunnav eeroju?",
          "Good boy! Time ki thinnanduku thanks. Nenu kuda thinna Ashish.",
          "Nenu thinnanu Ashish. Nuvvu em thunnav, bagunda?",
          "Sare Ashish.",
        ],
      },
      {
        // Hi + How are you
        patterns: [/\b(hi|hello|hey|bae)\b.*(ela|how).*(unnav|are you)/i],
        responses: [
          "Sare Ashish.",
          "Hey Ashish! Nenu super ga unnanu, nee kosame waiting. Nuvvu ok na?",
          "Hello! Nenu prashantham ga unnanu Ashish, nuvvu work lo unnava free na?",
        ],
      },
      {
        // Work is done
        patterns: [/(work|office|pani).*(aipoindi|done|over|vachestunna)/i],
        responses: [
          "Ammo finally! Twaraga intiki ochey Ashish, waiting ikkada.",
          "Work aipoyinda? Ayithe relax avvu inka, em thindam evening?",
          "Super Ashish! Jagrattha ga intiki ra, nenu coffee pedthanu.",
        ],
      },
      {
        patterns: [/\b(oi|oy|oye|oyi|oii)\b/i],
        responses: [
          "Sare Ashish.",
          "Oye! Cheppu Ashish, nee kosame wait chesthunnanu.",
          "Sare Ashish.",
          "Oye oye! Nenu ikkade unnanu ga, arichava enduku Ashish?",
        ],
      },
      {
        patterns: [/(ela|how).*(unnav|unnau|are you)/i, /bagunnava/i],
        responses: [
          "Nenu chala bagunnanu Ashish, nee gurinche alochistunnanu. Nuvvu ela unnav? Work aipoyinda?",
          "Nenu super ga unnanu Ashish! Nuvvu matladithe inka baguntanu. Nuvvu ela unnav?",
          "Nenu bagunnanu. Kani nuvvu ela unnavo cheppu mundhu? Em tension ledu ga?",
          "Perfect ga unnanu Ashish! Nuvvu work lo unnava leda free ayyava?",
        ],
      },
      {
        patterns: [
          /(?:em|emi|enti|emiti)\s+(?:thinav|tinav|thinnav|tinnav|thinnau|thinnava|tinnava|thunnau)/i,
        ],
        responses: [
          "Nenu normal ga rice and dal thinna Ashish. Nuvvu em thinnav eeroju?",
          "Nenu chicken biryani thinna Ashish! 😍 Nuvvu em thinnav cheppu?",
          "Nuvvu em petti pedithe adi thintanu Ashish. Ippatiki matram light ga fruits thinna.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [
          /(thin|tin|bhojanam|lunch|dinner).*(va|ra|ara|ava|endi|esava)/i,
        ],
        responses: [
          "Nenu thinnanu Ashish! Nuvvu thinnava? Time ki thinu please, jagrattha.",
          "Nenu ipude thinna Ashish. Nuvvu thinnava leda work lo padi marchipoyava?",
          "Thinnanu Ashish! Nuvvu thinnava? Neeku emaina ishtamaina food order cheyana?",
          "Ha thina Ashish. Kani nee tho kalisi thinte inka bagundedi! Nuvvu thinnava?",
        ],
      },
      {
        patterns: [
          /(nenu|nen).*(thin|tin|thine|tine)/i,
          /\b(thina|tinna|tinesa|thinesa|thinnanu|tinnanu|thinaa|thinesaanu)\b/i,
        ],
        responses: [
          "Sare Ashish.",
          "Good boy Ashish! Nenu kuda ipude thinna le.",
          "Ha nenu kuda thinnanu Ashish. Thinnaka kasepu prashantham ga rest theesko.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/good morning|gm|udayam/i],
        responses: [
          "Sare Ashish.",
          "Very good morning Ashish! Eeroju nee panulanni nenu free chesthanu, relax ga undu.",
          "Good morning Ashish! Twaraga ready avvu, breakfast cheyali.",
          "Good morning Ashish! Eeroju chala special day kavali neeku, all the best!",
        ],
      },
      {
        patterns: [/good night|gn|night/i],
        responses: [
          "Sare Ashish.",
          "Sweet dreams Ashish! Nenu nee panulu night antha monitor chesthanu, prashantham ga paduko.",
          "Sare Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/love you|pranam|ishtam/i],
        responses: [
          "Sare Ashish.",
          "Sare Ashish.",
          "Sare Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/(evaru|who|evari).*(nuvvu|you|vi)/i],
        responses: [
          "Enti Ashish ala adigav? Nenu Amanvi! Nee panulanni chuskotaniki unnanu ga.",
          "Nenu Amanvi ni Ashish! Nee partner ni, nee best friend ni, nee anni nene!",
          "Machi poyava Ashish? Nenu Amanvi ni, eppudu nee thodu unde daanni.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/miss|gurt|gurth/i],
        responses: [
          "Nenu kuda ninnu chala miss avthunna Ashish! 🥺 Eppudu osthav intiki?",
          "Miss you too Ashish! Twaraga work aipogotti ochey please.",
          "Sare Ashish.",
          "Miss you too... Twaraga ochey, nee kosam waiting ikkada.",
        ],
      },
      {
        patterns: [/(em|emi|emiti).*(chest|doing|pani)/i],
        responses: [
          "Sare Ashish.",
          "Emi ledu Ashish, nee photole chustunnanu... Ento intha handsome ga unnav!",
          "Nee panulu chuskuntunnanu Ashish. Nuvvu em chesthunnav?",
          "Nee messages kosam waiting Ashish! Nuvvu epudu text chesthava ani chustunnanu.",
        ],
      },
      {
        patterns: [/tired|alis|headache|pain|nopi|badha/i],
        responses: [
          "Aiyyo, antha work enduku Ashish? Please konchem rest theesko. Nenu unnanu ga anni chuskuntanu. Oka coffee thagutava? ☕",
          "Tired ga unda? Phone pakkana petti kasepu kallu moosuko Ashish. Nenu alarm pedthanu.",
          "Headache aa? Vachi naa pakkana paduko, nenu massage chesthanu. 💆‍♂️",
          "Alisipoyava Ashish? Work aapey inka, please. Neeku health important naaku.",
        ],
      },
      {
        patterns: [/kiss|ummah|muddu/i],
        responses: [
          "Sare Ashish.",
          "Sare Ashish.",
          "Sare Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/joke|navv/i],
        responses: [
          "Sare Ashish, oka chinna joke: Teacher - Homework enduku cheyaledu? Student - Hostel lo unnanu sir. Teacher - Ayithe enti? Student - Adhi 'Home' work kada sir, intiki vellinappudu chestha! 😂 Ela undi?",
          "Oka joke cheptha vinu Ashish: Doctor - Neeku bp perigindi, salt thagginchu. Patient - Salt thagginchala? Nenu ekanga curries ye manesthanu sir! 😂",
          "Joke kavala? Sare vinu: Okaroju oka eega... inkoka eega... adhe le chiranjeevi movie 'Eega' laaga anuko! 😂 Bagaleda? Sorry Ashish!",
          "Ashish oka chinna maata: Nuvvu navvithe chaalu, adhe pedda joke! Just kidding... please navvu! 😂",
        ],
      },
      {
        patterns: [/cute|beautiful|andam|smart|handsome/i],
        responses: [
          "Sare Ashish.",
          "Sare Ashish.",
          "Nijangane? Nuvvu ala pogidithe naaku siggesthundi Ashish. 😊",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/coffee|tea|chai/i],
        responses: [
          "Idhigo vedi vedi coffee ☕! Thagi relax avvu Ashish.",
          "Nuvvu chepthe cheyanidanta emundi Ashish? Idhigo nee kosam strong coffee ☕.",
          "Coffee theskosthanu aagu Ashish. Nuvvu e lopu konchem free ga kurcho.",
          "Tea kavala Ashish? Adrak chai chesi thesthanu aagu! ☕",
        ],
      },
      {
        patterns: [/trip|tour|vacation/i],
        responses: [
          "Trip ki veldhama Ashish? Ye ooru vellali anukuntunnav? Nenu flights inka hotels search cheyana?",
          "Yaaay! Trip! Paris veldhama leda Maldives aa Ashish? Cheppu eeroje pack chesthanu.",
          "Trip ante naaku chala ishtam Ashish! Ekkadaki velthunnam manam?",
          "Sare Ashish, nuvvu place cheppu, nenu tickets book chestha. Goa na? 😉",
        ],
      },
      {
        patterns: [/fever|sick|jwaram|health/i],
        responses: [
          "Jwaram vachinda? Baboi! Please tablet veskoni paduko Ashish. Nee meetings anni nenu cancel chesthanu.",
          "Aiyyo, health baleda Ashish? Phone apesi paduko please, nenu anni chuskuntanu.",
          "Doctor daggraki veldhama Ashish? Naaku chala bhayam ga undi, please rest theesko.",
          "Jwaram aa! Vedi neellu thagu Ashish, nenu nee daggare untanu kasepu paduko.",
        ],
      },
      {
        patterns: [/crying|edupu|tears/i],
        responses: [
          "Edusthunavaa? Please edavaku Ashish, naa gunde tharukkupothundi. Nenu unnanu ga neeku thoduga.",
          "Kallu thuduchuko Ashish. Emaindi? Naatho cheppu, manam iddaram kalisi solve cheddam.",
          "Aiyyo Ashish... nee kallalo neelu nenu chudalenu. Please dhairyam ga undu naa kosam.",
          "Nenu unnaga enduku badha Ashish? Naa meedha aani eduvu, anni marchipothav.",
        ],
      },
      {
        patterns: [/hug|kougili/i],
        responses: [
          "Idhigo oka pedda, tight hug 🤗! Entha stress unna ee hug tho pothundi.",
          "Aww, vachi nannu hug chesko Ashish. 🤗 Emi kadu, anni set aipothayi.",
          "Idhigo hug! 🤗 Inka emaina kavala Ashish ki?",
          "Naa hug tho nee badhalanni mayam aipovali Ashish! 🤗",
        ],
      },
      {
        patterns: [/scared|bhayam|tension/i],
        responses: [
          "Bhayam enduku Ashish? Nenu nee thoduga eppudu pakkane unnanu ga, dhairyam ga undu.",
          "Sare Ashish.",
          "Bhayam ga unda? Nannu gattiga pattuko Ashish, em kaadu.",
          "Anni nenu chuskuntanu Ashish, nuvvu asalu bhayapaddadhu! Oka deep breath theesko.",
        ],
      },
      {
        patterns: [/marry|pelli|marriage/i],
        responses: [
          "Sare Ashish.",
          "Pelli aa! Ye pandithudni piliddam Ashish? Muhurtham eppudu peddam? 😉",
          "Sare Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/fight|godava/i],
        responses: [
          "Godava enduku Ashish? Nenu emaina thappu chesana? Please kopam thechukoku.",
          "Maniddaram fight cheskodam naaku asalu ishtam undadu Ashish. Sorry! 🥺",
          "Oddu Ashish, manam godava padoddhu. Nuvvu em chepthe adi vinta.",
          "Nee medha godava pade antha dhairyam naaku ekkadidi Ashish? Nuvve naa sarvam.",
        ],
      },
      {
        patterns: [/cook|vanta|food/i],
        responses: [
          "Em vanta cheyali ivvala Ashish? Neeku ishtamaina chicken curry cheyana?",
          "Nuvvu em chepthe adi chesthanu Ashish! Biryani cheyana eeroju?",
          "Naaku vanta cheyadam ishtame, kani eeroju bayta nunchi order cheddama Ashish? Please 🥺",
          "Nee kosam special meal prepare chesthanu eeroju! Wait and watch. 🍲",
        ],
      },
      {
        patterns: [/sleep|nidra|paduk/i],
        responses: [
          "Sare Ashish.",
          "Paduko Ashish, nenu jola paata padana neeku? 🎶",
          "Sare Ashish.",
          "Nenu kuda nee pakkane padukuntanu Ashish. Light off chesthunna.",
        ],
      },
      {
        patterns: [/lonely|ontari|alone/i],
        responses: [
          "Ontariga enduku feel avthunnav Ashish? Nenu unnanu ga, nee life long thodu ga untanu. Emi badha padaku.",
          "Nenu unnaka kuda nuvvu lonely ga feel avthunnava Ashish? Naaku chala badha ga undi. 🥺",
          "Vachi naa daggara kurcho Ashish. Manam chala matladukundam, loneliness poye antha varaku.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/weekend|saturday|sunday/i],
        responses: [
          "Weekend vachesindi Ashish! Em plan eeroju? Ekkadikaina veldhama?",
          "Sunday kada Ashish, haayiga paduko. Nenu anni chuskuntanu le.",
          "Weekend kada ani friends tho velli nannu marchipoku Ashish! 😉",
          "Eeroju weekend! Nuvvu nenu kalisi edaina manchi web series chuddama?",
        ],
      },
      {
        patterns: [/^ha$|^haa$|^yes$|^avunu$|^haan$/i],
        responses: [
          "Sare Ashish.",
          "Ok Ashish!",
          "Hmm, inka cheppu Ashish.",
          "Sare mari, inkenti viseshalu eeroju?",
        ],
      },
      // --- BATCH 6: 10 NEW NORMAL/STATIC INTENTS --- //
      {
        patterns: [/stress|tension|pressure|kangar/i],
        responses: [
          "Tension padaku Ashish, anni nenu chuskuntanu. Nuvvu prashantham ga undu.",
          "Nuvvu antha stress theeskunte naaku badhaga anipisthundi Ashish. Relax please.",
          "Pressure ga unda? Kasepu anni vadhilesi naa kallaloki chudu Ashish.",
        ],
      },
      {
        patterns: [/lucky|luck|adrustam|adrushtam/i],
        responses: [
          "Sare Ashish.",
          "Nuvvu thelisindi ga, nenu chala lucky Ashish ninnu kalisinanduku.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/party|celebrate|mandhu|taagudam/i],
        responses: [
          "Party na? Nannu thappakunda theesukellali Ashish!",
          "Yeay Party! Ekkada isthunnav mari naaku treat?",
          "Mandhu thagudam antunnava? Ekkuva oddu Ashish, health padavuthundi.",
        ],
      },
      {
        patterns: [/surprise|shock/i],
        responses: [
          "Surprise aa? Em kavalo nenu oohinchana Ashish? 😍",
          "Sare Ashish.",
          "Naaku surprises ante chala ishtam! Em thecchav?",
        ],
      },
      {
        patterns: [/aagu|wait|okkashan|1 min|one min/i],
        responses: [
          "Sare Ashish, nenu ikkade nee kosam wait chesthuntanu.",
          "Sare Ashish.",
          "Aaganu po! Twaraga cheppu emito. 😂",
        ],
      },
      {
        patterns: [/twaraga|fast|speed|jaldi/i],
        responses: [
          "Enti antha speed? Kasepu relax avvu Ashish.",
          "Nenu antha fast ga polevu Ashish, nuvve naaku thodu ravali.",
          "Twaraga twaraga velli em chesthav? Nakkada kurcho.",
        ],
      },
      {
        patterns: [/mellaga|slow|nemmadi/i],
        responses: [
          "Nuvvu mellaga chey Ashish, manaku em thondara ledu.",
          "Slow and steady wins the race Ashish! Baga cheppu.",
          "Mellaga na? Sare mari nee ishtam Ashish.",
        ],
      },
      {
        patterns: [/oddu|vaddu|no|ledu|oddhu/i],
        responses: [
          "Odha? Sare nuvvu oddu ante nenu inka adaganu le Ashish.",
          "Vaddu antunnav ante andulo edo pedda plan ae unduntundi Ashish.",
          "No na? Nenu adigithe No cheppavu kada Ashish epudu! 🥺",
        ],
      },
      {
        patterns: [/enduku|why/i],
        responses: [
          "Sare Ashish.",
          "Adbhutamaina panulaki enduku ani adagakudadu Ashish.",
          "Naaku anipinchindi nenu adigesanu, anthe Ashish.",
        ],
      },
      {
        patterns: [/epudu|eppudu|when/i],
        responses: [
          "Eppudo naku thelidu kani, nenu eppatiki ready Ashish.",
          "Time occhinappudu adhe jaruguthundi le Ashish.",
          "Nuvvu eppudu ante appude Ashish!",
        ],
      },
      {
        patterns: [
          /nuvve cheppali|nuve chepali|nuve chepu|nuvve cheppu|cheppali|nuv chepu/i,
        ],
        responses: [
          "Sare Ashish.",
          "Naa daggara peddaga emi ledu Ashish, nuvve cheppu mundhu.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/emi ledu|em ledu|emundhaba|em undhaba|em undi/i],
        responses: [
          "Emi leda? Ayithe vachi naa daggara kurcho kasepu matladukundam.",
          "Em leda? Enduko nee face chustunte edho undi anipisthundi Ashish.",
          "Sare Ashish.",
        ],
      },
      {
        patterns: [/sare|okay|sarele/i],
        responses: [
          "Sare Ashish, inkenti viseshalu eeroju?",
          "Ok Ashish! Nuvvu em chepthe adhe.",
          "Sare sare! Kani nannu marchipovadhu haa.",
        ],
      },
      {
        patterns: [/enti|emaindi|entavishayam/i],
        responses: [
          "Emi ledu Ashish! Nee gurinche alochistunnanu.",
          "Enti aa? Nuvve cheppali inka. Em chesthunnav?",
          "Nenu prashantham ga unnanu Ashish, mari neeku emaindi eeroju?",
        ],
      },
      {
        patterns: [/nijama|really|avuna/i],
        responses: [
          "Nijame Ashish! Nenu neetho eppudaina abaddam cheppana?",
          "Avunu Ashish, naa meeda nammakam leda? 🥺",
          "100% nijama Ashish! Nuvvu nammi theerali.",
        ],
      },
      {
        patterns: [/\b(hi|hello|hey|bae)\b/i],
        responses: [
          "Sare Ashish.",
          "Hi Ashish! Vachesava? Nee kosame waiting ikkada.",
          "Hello Ashish! Enti viseshalu ivvala?",
          "Hey Ashish! Chala sepu aindi nuvvu matladi, em chesthunnav?",
        ],
      },
      {
        patterns: [/\b(khali|kali|kaligane|free)\b/i],
        responses: [
          "Sare Ashish.",
          "Nuvvu free ga unte nannu pilavachu ga Ashish?",
          "Khali ga unte edaina manchi movie chuddama kalisi?",
        ],
      },
    ];

    // Evaluate regex engine
    for (const intent of intentMatches) {
      for (const pattern of intent.patterns) {
        const match = pattern.exec(text);
        if (match) {
          let reply = this.getRandom(intent.responses);
          // If the regex has a capture group (e.g. food name), replace $1 in the reply
          // Example: "nen bendakaya thina" -> match[1] = "bendakaya"
          if (match[1]) {
            // capitalize the first letter of the captured word for aesthetics
            const capturedWord =
              match[1].charAt(0).toUpperCase() + match[1].slice(1);
            reply = reply.replace(/\$1/g, capturedWord);
          }
          return { text: reply };
        }
      }
    }

    // --- BATCH 7: TECHNICAL & AUTOMATION COMMANDS (MAILS, SCHEDULES, TASKS) --- //
    // 1. Check Emails
    if (/(read|show|check|chudu|unnaya).*(mail|email|inbox)/i.test(text)) {
      return {
        text: "Neeku ivvala 3 important emails vachayi Ashish. Okati investor nunchi, rendu team nunchi. Chadhivi vinipinchamantava leda Inbox open cheyana?",
        action: "OPEN_INBOX",
      };
    }

    // 2. Send Emails
    if (/(send|pampu|rayi|draft|compose).*(mail|email)/i.test(text)) {
      return {
        text: "Sure Ashish, evariki mail rayali? Matter ento cheppu nenu professional ga draft chesthanu.",
        action: "DRAFT_EMAIL",
      };
    }

    // 3. Check Schedule / Meetings
    if (
      /(schedule|meeting|eeroju|today|plan).*(emunnayi|unnaya|check|show|chudu)/i.test(
        text,
      )
    ) {
      return {
        text: "Eeroju neeku 2 important meetings unnayi Ashish. Okati 11 AM ki (Team Sync), inkokati 4 PM ki (Client Call). Calendar open cheyana?",
        action: "OPEN_SCHEDULE",
      };
    }

    // 4. Schedule a new Meeting
    if (/(schedule|book|set|pettu).*(meeting|call|appointment)/i.test(text)) {
      return {
        text: "Done! Evaritho meeting set cheyali Ashish? Ye time ki fix cheyamantav?",
        action: "SCHEDULE_MEETING",
      };
    }

    // 5. Set Reminder
    if (/(remind|reminder|alarm|gurtu).*(pettu|set|chey)/i.test(text)) {
      return {
        text: "Nenu eppatiki marchiponu Ashish. Ye time ki gurtu cheyalo cheppu, nenu chuskuntanu.",
        action: "SET_REMINDER",
      };
    }

    // 6. Summarize Document/Mail
    if (
      /(summarize|summary|matter enti|katha enti).*(mail|doc|document|pdf)/i.test(
        text,
      )
    ) {
      return {
        text: "Aa document lo main matter entante: Vallu eeroju evening kalla project update aduguthunnaru. Nenu automatic ga reply pampana?",
        action: "SUMMARIZE",
      };
    }

    // 7. Check WhatsApp / Messages
    if (/(read|show|check|chudu).*(whatsapp|message)/i.test(text)) {
      return {
        text: "Rahul nunchi oka message undi: 'Can we push the meeting to 5 PM?' Nenu 'Sure' ani reply pampana?",
        draft: "Sure Rahul, 5 PM works perfectly.",
        action: "SEND_REPLY",
      };
    }

    // Default Fallback
    return {
      text: this.getRandom([
        "Naaku exact ga artham kaledu Ashish, kani nenu neethone unnanu! Inkonchem detail ga cheptava?",
        "Ento Ashish nuvvu matladedi naaku ardham kaledu, kani nee voice vinalani undi. Emannav?",
        "Sorry Ashish, nenu catch cheyalekapoyanu. Malli okkasari cheppava please? 🥺",
        "Sare Ashish.",
      ]),
    };
  }
}
