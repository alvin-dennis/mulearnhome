import type { LucideIcon } from "lucide-react";
import { Building2, HelpCircle, Lightbulb, Target } from "lucide-react";
import { cdnUrl } from "@/services/cdn";

export interface EnablerFeature {
  text: string;
  icon: LucideIcon;
}

export const enablers = {
  benefits: [
    {
      title: "Industry Immersion Programs",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits1.webp"),
      items: [
        {
          text: "Offering short-term industry internships to stay connected with current practices and emerging technologies.",
        },
        {
          text: "TA's and presenters can be moved to the front of the class.",
        },
      ],
      bgColor: "bg-mulearn-blackish",
      textColor: "text-mulearn-whitish",
    },
    {
      title: "Up-Skill Programs",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits2.webp"),
      items: [
        {
          text: "Providing a platform for enablers to gain insights from industry mentors.",
        },
        {
          text: "Enablers can enhance their skills and stay updated with emerging technologies.",
        },
        {
          text: "Workshops focused on technology, no-code solutions, Git, GitHub, and open-source programs.",
        },
      ],
      bgColor: "bg-blue-500",
      textColor: "text-mulearn-whitish",
    },
    {
      title: "Meet-ups",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits3.webp"),
      items: [
        {
          text: "Enabler meet-ups with industry and peers offer statewide networking opportunities.",
        },
        {
          text: "Monthly District Meetups: Virtual/Offline events to track progress and engagement.",
        },
        {
          text: "Zonal Meetups: Organized offline events by zonal heads once every 3 months.",
        },
      ],
      bgColor: "bg-blue-100",
      textColor: "text-mulearn-blackish",
    },
  ],

  features: [
    {
      text: "Provide direction and ensure healthy chapter functioning",
      icon: Target,
    },
    {
      text: "Guide student leads when needed",
      icon: HelpCircle,
    },
    {
      text: "Support a culture of exploration and practical learning",
      icon: Lightbulb,
    },
    {
      text: "Facilitate industry or campus-level opportunities.",
      icon: Building2,
    },
  ] as EnablerFeature[],

  programs: [
    {
      title: "Learning Fest For Enablers",
      description:
        "Are you passionate about helping others reach their full potential? 👀 Join us at Learning Fest, where you can enhance your skills as a mentor 💫 Explore new teaching techniques, network with fellow enablers, and help shape the future of education",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Project1.webp"),
      link: "https://mulearn.org/r/enablers-learningfest",
      cta: "Enroll Now",
    },
    {
      title: "Art of Teaching - Teach Contest",
      description:
        "Art of Teaching is an annual event that spotlights enablers' teaching talents. They can showcase their skills through videos, simplifying concepts for students. In the last edition, we received 150+ video entries and rewarded winners with cash prizes.",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Project2.webp"),
      link: "https://mulearn.org/artofteaching",
      cta: "Know More",
    },
  ],

  onboarding: [
    {
      number: "01",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Mu.webp"),
      title: "Create µLearn Profile",
      description:
        'Enablers should create a profile via app.mulearn.org, and they should ensure to register as a faculty member by choosing the option "I\'m teaching in an Institute". Once you get a profile, go to "Connect Discord" and join our Discord server.',
      link: "https://app.mulearn.org/",
      linkText: "app.mulearn.org",
    },
    {
      number: "02",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Discord.webp"),
      title: "Welcome to Discord",
      description:
        "Once you join the server, our bot, Aaronchetan will send you a DM asking you to connect your µ-ID, which is provided in the µlearn profile. Once it's connected, you can start your onboarding process.",
      link: "https://discord.gg/3v5GvJ8",
      linkText: "Join Discord",
    },
    {
      number: "03",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Bulb.webp"),
      title: "Add Interest Groups",
      description:
        "Now you will have access to the #lvl1-info channel, and as you do the tasks, you will progress through the levels. Once you reach level 4, you will have the option to edit Interest Groups on your µlearn profile page.",
      link: "https://app.mulearn.org/",
      linkText: "Explore Interests",
    },
  ],

  successStories: [
    {
      name: "Dr. A G Mathew",
      role: "Principal, St. Thomas Institute of Science and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=xbsRahh_mIschz-R",
      thumbnail: "/assets/be-a-part/thumbnails/ag-mathew.webp",
    },
    {
      name: "Dr. Neelakantan P C",
      role: "Principal, Muthoot Institute of Science and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=2qGCXXH89j9yzmZ-&t=21",
      thumbnail: "/assets/be-a-part/thumbnails/neelakantan-pc.webp",
    },
    {
      name: "Sharika T R",
      role: "Lead Enabler µLearn, Adi Shankara Institute of Engineering and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=_qT1fFmQJVmlmJmg&t=63",
      thumbnail: "/assets/be-a-part/thumbnails/sharika-tr.webp",
    },
    {
      name: "Dr. M Manoj",
      role: "Lead Enabler µLearn, Marian Engineering College",
      url: "https://youtu.be/oyvb4-decaY?si=fEPdIxDP4uanErYi&t=73",
      thumbnail: "/assets/be-a-part/thumbnails/m-manoj.webp",
    },
  ],
  colleges: [
    {
      title: "Carmel College of Engineering and Technology",
    },
    {
      title: "Providence College of Engineering & School of Business Chengannur",
    },
    {
      title: "College of Engineering Chengannur",
    },
    {
      title: "Sree Buddha College of Engineering Pattoor",
    },
    {
      title: "Cochin University College of Engineering, Kuttanadu",
    },
    {
      title: "Adi Shankara College of Engineering",
    },
    {
      title: "Ilahia College of Engineering and Technology",
    },
    {
      title: "Mar Elias College, Kottappady, Ernakulam",
    },
    {
      title: "MES College of Engineering Technology Kunnukara",
    },
    {
      title: "MES MK Mackar Pillai College for Advanced Studies",
    },
    {
      title: "Muthoot Institute of Technology & Science",
    },
    {
      title: "Rajagiri School of Engineering and Technology",
    },
    {
      title: "SCMS School of Engineering and Technology",
    },
    {
      title: "Sree Narayana Gurukulam College of Engineering",
    },
    {
      title: "TocH Institute of Science and Technology",
    },
    {
      title: "Visat Engineering College",
    },
    {
      title: "Viswajyothy College of Engineering and Technology",
    },
    {
      title: "Federal Institute of Science and Technology",
    },
    {
      title: "Government Engineering College Idukki",
    },
    {
      title: "Mar Baselios Christian College of Engineering & Technology",
    },
    {
      title: "College of Engineering Thalassery",
    },
    {
      title: "Government College of Engineering Kannur",
    },
    {
      title: "Kodiyeri Balakrishnan Memorial Government College",
    },
    {
      title: "College of Engineering Trikaripur",
    },
    {
      title: "LBS College of Engineering",
    },
    {
      title: "College of Engineering - Kottarakkara",
    },
    {
      title: "College of Engineering - Pathanapuram",
    },
    {
      title: "College of Engineering Karunagappally",
    },
    {
      title: "College of Engineering Perumon",
    },
    {
      title: "Amal Jyothi College of Engineering Kanjirappally",
    },
    {
      title: "Kottayam Institute of Science and Technology",
    },
    {
      title: "Kristu Jyoti College of Management and Technology",
    },
    {
      title: "Rajiv Gandhi Institute of Technology Kottayam",
    },
    {
      title: "Saintgits College of Engineering",
    },
    {
      title: "St Josephs College of Engineering and Technology Palai",
    },
    {
      title: "AWH Engineering College",
    },
    {
      title: "College of Applied Science IHRD, Kozhikode",
    },
    {
      title: "College of Engineering Vadakara",
    },
    {
      title: "Govt. Engineering College - Kozhikode",
    },
    {
      title: "Muhammad Abdurahiman Memorial Orphanage College",
    },
    {
      title: "St. Josephs College Devagiri (Autonomous)",
    },
    {
      title: "Sree Gokulam Arts and Science College Baluserry",
    },
    {
      title: "Al Shifa College of Arts and Science",
    },
    {
      title: "CHMKM Govt Arts and Science College Tanur",
    },
    {
      title: "Malabar College of Advanced Studies",
    },
    {
      title: "MES College of Engineering - Kuttippuram",
    },
    {
      title: "MES Ponnani College",
    },
    {
      title: "Government Engineering College Sreekrishnapuram",
    },
    {
      title: "Mount Seena College of Arts and Science",
    },
    {
      title: "NSS College of Engineering Palakkad",
    },
    {
      title: "Sreepathy Institute of Management and Technology",
    },
    {
      title: "Ahalia School of Engineering and Technology",
    },
    {
      title: "Al Ameen Engineering College",
    },
    {
      title: "College of Engineering Aranmula",
    },
    {
      title: "College of Engineering Kallooppara",
    },
    {
      title: "Musaliar College of Arts and Science Pathanamthitta",
    },
    {
      title: "Christ College of Engineering",
    },
    {
      title: "Government Engineering College Thrissur",
    },
    {
      title: "Government Polytechnic College, Kunnamkulam",
    },
    {
      title: "Jyothi Engineering College",
    },
    {
      title: "Sahrdaya College of Engineering & Technology",
    },
    {
      title: "Thejus Engineering College",
    },
    {
      title: "Vidya Academy of Science and Technology",
    },
    {
      title: "ACE College of Engineering",
    },
    {
      title: "College of Engineering Muttathara",
    },
    {
      title: "College of Engineering Trivandrum",
    },
    {
      title: "LBS Institute of Technology for Women - Poojappura",
    },
    {
      title: "Lourdes Matha College of Science and Technology",
    },
    {
      title: "Mar Baselios College of Engineering and Technology",
    },
    {
      title: "Marian Engineering College",
    },
    {
      title: "Mohandas College of Engineering and Technology",
    },
    {
      title: "Muslim Association College of Engineering",
    },
    {
      title: "Rajadhani Institute of Engineering and Technology",
    },
    {
      title: "Sree Chitra Thirunal College of Engineering",
    },
    {
      title: "St. Thomas Institute for Science & Technology",
    },
    {
      title: "Trinity College of Engineering",
    },
    {
      title: "University College of Engineering Kariavattom",
    },
    {
      title: "WMO Arts and Science College",
    },
  ],

  faculties: [
    {
      muid: "ranisarithar@mulearn",
      full_name: "Rani Saritha R",
    },
    {
      muid: "sunilk.joseph@mulearn",
      full_name: "Sunil K. Joseph",
    },
    {
      muid: "jibinn@mulearn",
      full_name: "Jibin N",
    },
    {
      muid: "donajose-1@mulearn",
      full_name: "Dona Jose",
    },
    {
      muid: "arunjs@mulearn",
      full_name: "Arun J S",
    },
    {
      muid: "sonashaju@mulearn",
      full_name: "Sona Shaju",
    },
    {
      muid: "dr.nishaas@mulearn",
      full_name: "Dr. Nisha A S",
    },
    {
      muid: "anilantony-1@mulearn",
      full_name: "Anil Antony",
    },
    {
      muid: "sarjus@mulearn",
      full_name: "Sarju S",
    },
    {
      muid: "shareeqshabeer@mulearn",
      full_name: "Shareeq Shabeer",
    },
    {
      muid: "anjus-5@mulearn",
      full_name: "ANJU S",
    },
    {
      muid: "sreeshps@mulearn",
      full_name: "SREESH P S",
    },
    {
      muid: "neethuthomas@mulearn",
      full_name: "NEETHU THOMAS",
    },
    {
      muid: "ajuphilip@mulearn",
      full_name: "Aju Philip",
    },
    {
      muid: "lekshmishan@mulearn",
      full_name: "Lekshmi Shan",
    },
    {
      muid: "sreejithkb@mulearn",
      full_name: "Sreejith K B",
    },
    {
      muid: "snehasreedevi@mulearn",
      full_name: "Sneha Sreedevi",
    },
    {
      muid: "neethu-1@mulearn",
      full_name: "NEETHU V A",
    },
    {
      muid: "ziyad@mulearn",
      full_name: "MOHAMED ZIYAD TA",
    },
    {
      muid: "rejinr@mulearn",
      full_name: "Rejin R",
    },
    {
      muid: "daphna@mulearn",
      full_name: "Daphna",
    },
    {
      muid: "dr.umeshp@mulearn",
      full_name: "Dr. Umesh P",
    },
    {
      muid: "anishaaziz-1@mulearn",
      full_name: "ANISH A AZIZ",
    },
    {
      muid: "ramziyah@mulearn",
      full_name: "Ramziya H",
    },
    {
      muid: "suminasuresan@mulearn",
      full_name: "SUMINA SURESAN",
    },
    {
      muid: "anuantony@mulearn",
      full_name: "ANU ANTONY",
    },
    {
      muid: "jishak@mulearn",
      full_name: "Jisha K",
    },
    {
      muid: "minumc@mulearn",
      full_name: "Minu MC",
    },
    {
      muid: "dr.elsacherian@mulearn",
      full_name: "Dr. Elsa Cherian",
    },
    {
      muid: "amalthukku@mulearn",
      full_name: "Amal Thukku",
    },
    {
      muid: "vishaginiv@mulearn",
      full_name: "Vishagini V",
    },
    {
      muid: "sojajoy@mulearn",
      full_name: "SOJA Joy",
    },
    {
      muid: "dhanyalk@mulearn",
      full_name: "Dhanya L K",
    },
    {
      muid: "rajimolv@mulearn",
      full_name: "Rajimol V",
    },
    {
      muid: "bharathanss@mulearn",
      full_name: "Bharathan S S",
    },
    {
      muid: "ancyalex@mulearn",
      full_name: "Ancy Alex",
    },
    {
      muid: "sumitra-2@mulearn",
      full_name: "sumitra",
    },
    {
      muid: "giridharc-4@mulearn",
      full_name: "Giridhar C",
    },
    {
      muid: "archanat-1@mulearn",
      full_name: "ARCHANA T",
    },
    {
      muid: "hridhyahridhya@mulearn",
      full_name: "Hridhya Hridhya",
    },
    {
      muid: "sudheeshss@mulearn",
      full_name: "SUDHEESH S S",
    },
    {
      muid: "jyothijohnson@mulearn",
      full_name: "Jyothi Johnson",
    },
    {
      muid: "soumyaremesh@mulearn",
      full_name: "Soumya Remesh",
    },
    {
      muid: "arunpkuttappan@mulearn",
      full_name: "ARUN P KUTTAPPAN",
    },
    {
      muid: "aravintthm@mulearn",
      full_name: "Aravintth M",
    },
    {
      muid: "jomonraju@mulearn",
      full_name: "Jomon Raju",
    },
    {
      muid: "dr.m.manoj@mulearn",
      full_name: "Dr. M.Manoj",
    },
    {
      muid: "abdulsamadc@mulearn",
      full_name: "Abdul Samad C",
    },
    {
      muid: "rejimoanr@mulearn",
      full_name: "REJIMOAN R",
    },
    {
      muid: "daruannathomas@mulearn",
      full_name: "DARU ANNA THOMAS",
    },
    {
      muid: "riyakazeez@mulearn",
      full_name: "Riya K Azeez",
    },
    {
      muid: "shereenasherif@mulearn",
      full_name: "Shereena sherif",
    },
    {
      muid: "mohananvkl@mulearn",
      full_name: "MOHANAN VKL",
    },
    {
      muid: "kavithas@mulearn",
      full_name: "Kavitha S",
    },
    {
      muid: "divyasusanmathew@mulearn",
      full_name: "Divya Susan Mathew",
    },
    {
      muid: "jishajames@mulearn",
      full_name: "Jisha James",
    },
    {
      muid: "dr.gileshmp@mulearn",
      full_name: "Dr. Gilesh M P",
    },
    {
      muid: "dominicthomas@mulearn",
      full_name: "Dominic Thomas",
    },
    {
      muid: "sojasalim@mulearn",
      full_name: "Soja Salim",
    },
    {
      muid: "ayanaajith@mulearn",
      full_name: "Ayana Ajith",
    },
    {
      muid: "sijithamolks@mulearn",
      full_name: "Sijitha Mol K S",
    },
    {
      muid: "abhijitv@mulearn",
      full_name: "Abhijit V",
    },
    {
      muid: "reubenthomas@mulearn",
      full_name: "Reuben Thomas",
    },
    {
      muid: "sujeshkr-1@mulearn",
      full_name: "Sujesh K R",
    },
    {
      muid: "vinode@mulearn",
      full_name: "VINOD E",
    },
    {
      muid: "jasmins@mulearn",
      full_name: "Jasmin S",
    },
    {
      muid: "arunalex-1@mulearn",
      full_name: "Arun Alex",
    },
    {
      muid: "muralikrishnank-1@mulearn",
      full_name: "Murali Krishnan K",
    },
    {
      muid: "sebinjose@mulearn",
      full_name: "SEBIN JOSE",
    },
    {
      muid: "anjus-3@mulearn",
      full_name: "Anju S",
    },
    {
      muid: "parvathycj@mulearn",
      full_name: "PARVATHY C J",
    },
    {
      muid: "santhoshsn@mulearn",
      full_name: "SANTHOSH S N",
    },
    {
      muid: "mercelinfrancis@mulearn",
      full_name: "MERCELIN FRANCIS",
    },
    {
      muid: "jeenajacob@mulearn",
      full_name: "JEENA JACOB",
    },
    {
      muid: "binduannthomas@mulearn",
      full_name: "Bindu Ann Thomas",
    },
    {
      muid: "anithkrishnan@mulearn",
      full_name: "Anith Krishnan",
    },
    {
      muid: "rahulponneth@mulearn",
      full_name: "Rahul Ponneth",
    },
    {
      muid: "smithajacob@mulearn",
      full_name: "Smitha Jacob",
    },
    {
      muid: "dr.rajeevp.-4@mulearn",
      full_name: "Dr. RAJEEV P.",
    },
    {
      muid: "jesnamohan@mulearn",
      full_name: "Jesna Mohan",
    },
    {
      muid: "aswathychandran-2@mulearn",
      full_name: "ASWATHY  CHANDRAN",
    },
    {
      muid: "syamrajbs@mulearn",
      full_name: "SYAMRAJ B S",
    },
    {
      muid: "ezudheen@mulearn",
      full_name: "Ezudheen",
    },
    {
      muid: "dhanooopk@mulearn",
      full_name: "Dhanoop K",
    },
    {
      muid: "geethumsuresh@mulearn",
      full_name: "Geethu M Suresh",
    },
    {
      muid: "hazeenayoosaf-1@mulearn",
      full_name: "Hazeena Yoosaf",
    },
    {
      muid: "ajeeshs-3@mulearn",
      full_name: "Ajeesh S",
    },
    {
      muid: "algababy@mulearn",
      full_name: "Alga BABY",
    },
    {
      muid: "nishimolm@mulearn",
      full_name: "Nishimol M",
    },
    {
      muid: "serinvsimpson@mulearn",
      full_name: "SERIN V SIMPSON",
    },
    {
      muid: "aneesmuhammed@mulearn",
      full_name: "Anees Muhammed",
    },
    {
      muid: "safnak-2@mulearn",
      full_name: "Safna K",
    },
    {
      muid: "narasimhant@mulearn",
      full_name: "Narasimhan T",
    },
    {
      muid: "elvinkuruvilla@mulearn",
      full_name: "Elvin Kuruvilla",
    },
    {
      muid: "harikrishnanb-2@mulearn",
      full_name: "Harikrishnan B",
    },
    {
      muid: "lajeeshm@mulearn",
      full_name: "Lajeesh M",
    },
    {
      muid: "annalex@mulearn",
      full_name: "Ann Alex",
    },
    {
      muid: "sreenav.g.@mulearn",
      full_name: "Sreena V.G.",
    },
    {
      muid: "sagara@mulearn",
      full_name: "Sagara",
    },
    {
      muid: "jishamohan@mulearn",
      full_name: "Jisha Mohan",
    },
    {
      muid: "aswinasok110@mulearn",
      full_name: "Aswin Asok 110",
    },
    {
      muid: "bismipr@mulearn",
      full_name: "Bismi PR",
    },
    {
      muid: "ranijose@mulearn",
      full_name: "Rani Jose",
    },
    {
      muid: "ambilirathnakaran@mulearn",
      full_name: "Ambili Rathnakaran",
    },
    {
      muid: "nishleyelizabethjoseph@mulearn",
      full_name: "Nishley Elizabeth Joseph",
    },
    {
      muid: "anithavarghese-1@mulearn",
      full_name: "Anitha Varghese",
    },
    {
      muid: "sathishkumarm@mulearn",
      full_name: "Sathish kumar M",
    },
    {
      muid: "sreejeshvk@mulearn",
      full_name: "SREEJESH V K",
    },
    {
      muid: "mrs.annmarypaul-1@mulearn",
      full_name: "Mrs. Ann Mary Paul",
    },
    {
      muid: "akhilav@mulearn",
      full_name: "AKHILA V",
    },
    {
      muid: "anjanathampys-1@mulearn",
      full_name: "ANJANA THAMPY S",
    },
    {
      muid: "rameshm@mulearn",
      full_name: "Ramesh M",
    },
    {
      muid: "abhijithmk@mulearn",
      full_name: "Abhijith M K",
    },
    {
      muid: "anjuraveendran@mulearn",
      full_name: "Anju Raveendran",
    },
    {
      muid: "sajeshkumaru-1@mulearn",
      full_name: "sajesh kumar U",
    },
    {
      muid: "jayaramv@mulearn",
      full_name: "Jayaram v",
    },
    {
      muid: "anilanr@mulearn",
      full_name: "ANILAN R",
    },
    {
      muid: "vysakhv@mulearn",
      full_name: "VYSAKH V",
    },
    {
      muid: "harikrishnangr@mulearn",
      full_name: "Harikrishnan G R",
    },
    {
      muid: "sharikatr@mulearn",
      full_name: "SHARIKA TR",
    },
    {
      muid: "shinirenjith-3@mulearn",
      full_name: "Shini Renjith",
    },
    {
      muid: "dr.binduantoollukkaran-1@mulearn",
      full_name: "Dr.Bindu Anto Ollukkaran",
    },
    {
      muid: "sunitharaj@mulearn",
      full_name: "Sunitha raj",
    },
    {
      muid: "soniyab@mulearn",
      full_name: "Soniya B",
    },
    {
      muid: "askark@mulearn",
      full_name: "ASKAR K",
    },
    {
      muid: "snehatsubrahmanian-2@mulearn",
      full_name: "SNEHA T SUBRAHMANIAN",
    },
    {
      muid: "swathik-1@mulearn",
      full_name: "SWATHI K",
    },
    {
      muid: "shankarj@mulearn",
      full_name: "Shankar J",
    },
    {
      muid: "nayanasuresh@mulearn",
      full_name: "NAYANA SURESH",
    },
    {
      muid: "neenur@mulearn",
      full_name: "Neenu R",
    },
    {
      muid: "harikrishnani@mulearn",
      full_name: "HARIKRISHNAN I",
    },
    {
      muid: "shirassn@mulearn",
      full_name: "SHIRAS S N",
    },
    {
      muid: "divyas-2@mulearn",
      full_name: "Divya S",
    },
    {
      muid: "gopinathan.c@mulearn",
      full_name: "GOPINATHAN. C",
    },
    {
      muid: "shabnamk@mulearn",
      full_name: "SHABNA M K",
    },
    {
      muid: "felixmphilip@mulearn",
      full_name: "Felix M Philip",
    },
    {
      muid: "dr.paulpmathai@mulearn",
      full_name: "Dr. PAUL P MATHAI",
    },
    {
      muid: "deepus@mulearn",
      full_name: "Deepu S",
    },
    {
      muid: "sandeep@mulearn",
      full_name: "Sandeep",
    },
    {
      muid: "reshmikrishnaprasad@mulearn",
      full_name: "RESHMI KRISHNA PRASAD",
    },
    {
      muid: "ibrahimsalimm@mulearn",
      full_name: "Ibrahim Salim M",
    },
    {
      muid: "jamshi@mulearn",
      full_name: "Jamshi",
    },
    {
      muid: "dhaneshmn@mulearn",
      full_name: "Dhanesh M N",
    },
    {
      muid: "syamrajbs-1@mulearn",
      full_name: "SYAMRAJ B S",
    },
    {
      muid: "aswathyer@mulearn",
      full_name: "ASWATHY E R",
    },
    {
      muid: "nafeesathnajaba@mulearn",
      full_name: "Nafeesath Najaba",
    },
    {
      muid: "santharamrao@mulearn",
      full_name: "Santharamrao",
    },
    {
      muid: "jikkuthomasjikku@mulearn",
      full_name: "Jikku thomas Jikku",
    },
    {
      muid: "joethomas-1@mulearn",
      full_name: "Joe Thomas",
    },
    {
      muid: "shameelk@mulearn",
      full_name: "Shameel K",
    },
    {
      muid: "smithac@mulearn",
      full_name: "Smitha C",
    },
    {
      muid: "arshaap@mulearn",
      full_name: "Arsha A P",
    },
    {
      muid: "sajithav.raj@mulearn",
      full_name: "Sajitha V. Raj",
    },
    {
      muid: "rashidummernt@mulearn",
      full_name: "Rashid Ummer NT",
    },
    {
      muid: "sindhuar@mulearn",
      full_name: "SINDHU A R",
    },
    {
      muid: "sireeshmmaniyeri@mulearn",
      full_name: "Sireesh M Maniyeri",
    },
    {
      muid: "tpcce_trikaripur@mulearn",
      full_name: "TPC CE_Trikaripur",
    },
    {
      muid: "sonysethukumar@mulearn",
      full_name: "SONY SETHUKUMAR",
    },
    {
      muid: "renyaraveendran@mulearn",
      full_name: "Renya Raveendran",
    },
    {
      muid: "syameshkg-1@mulearn",
      full_name: "SYAMESH K G",
    },
    {
      muid: "rahulpraj@mulearn",
      full_name: "RAHUL P RAJ",
    },
    {
      muid: "ratheeshkumars@mulearn",
      full_name: "Ratheesh Kumar S",
    },
    {
      muid: "sajinmv@mulearn",
      full_name: "Sajin MV",
    },
    {
      muid: "shanun@mulearn",
      full_name: "Shanu N",
    },
    {
      muid: "jasinkt@mulearn",
      full_name: "JASIN K T",
    },
    {
      muid: "chinnmohanan@mulearn",
      full_name: "Chinn Mohanan",
    },
    {
      muid: "justinjoseph-2@mulearn",
      full_name: "Justin Joseph",
    },
    {
      muid: "reshmavr@mulearn",
      full_name: "Reshma V R",
    },
    {
      muid: "babithapk@mulearn",
      full_name: "Babitha P K",
    },
    {
      muid: "sudheeshkv@mulearn",
      full_name: "Sudheesh K V",
    },
    {
      muid: "jyothisk.p.-2@mulearn",
      full_name: "Jyothis K.P.",
    },
    {
      muid: "tessymathew@mulearn",
      full_name: "Tessy Mathew",
    },
    {
      muid: "sujithd_tpo_sngcet@mulearn",
      full_name: "Sujith D_tpo_sngcet",
    },
    {
      muid: "kmctce@mulearn",
      full_name: "KMCTCE",
    },
    {
      muid: "r.pradeepkumar@mulearn",
      full_name: "R.Pradeep Kumar",
    },
    {
      muid: "archanam-3@mulearn",
      full_name: "Archana M",
    },
    {
      muid: "soumyaav-1@mulearn",
      full_name: "Soumya A V",
    },
    {
      muid: "divyads@mulearn",
      full_name: "Divya DS",
    },
    {
      muid: "justinemaugustine-2@mulearn",
      full_name: "Justine M Augustine",
    },
    {
      muid: "arunp@mulearn",
      full_name: "Arun P",
    },
    {
      muid: "neethucsekhar@mulearn",
      full_name: "Neethu C Sekhar",
    },
    {
      muid: "rohithram_tpo_coe_vadakara@mulearn",
      full_name: "Rohithram_TPO_COE_vadakara",
    },
    {
      muid: "nikithav@mulearn",
      full_name: "NIKITHA V",
    },
    {
      muid: "vinodk@mulearn",
      full_name: "Vinod K",
    },
    {
      muid: "sebinsunny@mulearn",
      full_name: "Sebin Sunny",
    },
    {
      muid: "annrijapaul@mulearn",
      full_name: "Ann Rija Paul",
    },
    {
      muid: "litheyajohn@mulearn",
      full_name: "Litheya john",
    },
    {
      muid: "amjedali@mulearn",
      full_name: "Amjed Ali",
    },
    {
      muid: "jayanandb-1@mulearn",
      full_name: "Jayanand B",
    },
    {
      muid: "neenarajnr@mulearn",
      full_name: "Neena Raj N R N R",
    },
    {
      muid: "jouharc-1@mulearn",
      full_name: "Jouhar C",
    },
    {
      muid: "cinijoseph@mulearn",
      full_name: "Cini Joseph",
    },
    {
      muid: "remyakrishnajs-1@mulearn",
      full_name: "Remya Krishna J S",
    },
    {
      muid: "manjuk@mulearn",
      full_name: "Manju K",
    },
    {
      muid: "drgileshmp@mulearn",
      full_name: "Dr Gilesh M P",
    },
    {
      muid: "aswinimanoli@mulearn",
      full_name: "Aswini Manoli",
    },
    {
      muid: "swertdan@mulearn",
      full_name: "Swert Dan",
    },
    {
      muid: "simichakkarayan@mulearn",
      full_name: "Simi Chakkarayan",
    },
    {
      muid: "shyamraj.r@mulearn",
      full_name: "Shyamraj.R",
    },
    {
      muid: "baijubs@mulearn",
      full_name: "BAIJU B S",
    },
    {
      muid: "greeshmangopal@mulearn",
      full_name: "Greeshma N Gopal",
    },
    {
      muid: "abdulali@mulearn",
      full_name: "Abdul Ali",
    },
    {
      muid: "shahadp@mulearn",
      full_name: "SHAHAD P",
    },
    {
      muid: "thulasirajank@mulearn",
      full_name: "Thulasi Rajan K",
    },
    {
      muid: "sudevank@mulearn",
      full_name: "Sudevan K",
    },
    {
      muid: "bijup.k@mulearn",
      full_name: "BIJU P.K",
    },
    {
      muid: "jonarp@mulearn",
      full_name: "Jona RP",
    },
    {
      muid: "vinithav-1@mulearn",
      full_name: "Vinitha v",
    },
    {
      muid: "anugeorge@mulearn",
      full_name: "Anu George",
    },
    {
      muid: "jijojose-1@mulearn",
      full_name: "Jijo Jose",
    },
    {
      muid: "renjithr-2@mulearn",
      full_name: "Renjith R",
    },
    {
      muid: "rajeshu@mulearn",
      full_name: "RAJESH U",
    },
    {
      muid: "rensisammathew@mulearn",
      full_name: "Rensi Sam Mathew",
    },
    {
      muid: "varghesescaria@mulearn",
      full_name: "Varghese Scaria",
    },
    {
      muid: "greeshmat.@mulearn",
      full_name: "GREESHMA T.",
    },
    {
      muid: "jyothishjohn@mulearn",
      full_name: "Jyothish John",
    },
    {
      muid: "abelgeorge@mulearn",
      full_name: "Abel George",
    },
    {
      muid: "ananthalekshmiml@mulearn",
      full_name: "Anantha Lekshmi M L",
    },
    {
      muid: "princevjose@mulearn",
      full_name: "Prince V Jose",
    },
    {
      muid: "ancysaravarghese@mulearn",
      full_name: "Ancy Sara Varghese",
    },
    {
      muid: "mssujithra@mulearn",
      full_name: "M S Sujithra",
    },
    {
      muid: "nithyapaul@mulearn",
      full_name: "Nithya Paul",
    },
    {
      muid: "angelmbits@mulearn",
      full_name: "Angel MBITS",
    },
    {
      muid: "reshmamr@mulearn",
      full_name: "Reshma M R",
    },
    {
      muid: "dhakshusivan@mulearn",
      full_name: "Dhakshu Sivan",
    },
    {
      muid: "bhagyasreepv@mulearn",
      full_name: "Bhagyasree P V",
    },
    {
      muid: "josevmathew-1@mulearn",
      full_name: "Jose V Mathew",
    },
    {
      muid: "vishnuprasads@mulearn",
      full_name: "Vishnu Prasad S",
    },
    {
      muid: "prasoons@mulearn",
      full_name: "Prasoon S",
    },
    {
      muid: "neethupr-1@mulearn",
      full_name: "Neethu PR",
    },
    {
      muid: "jentyjoy-1@mulearn",
      full_name: "JENTY JOY",
    },
    {
      muid: "shyamrajr@mulearn",
      full_name: "Shyamraj R",
    },
    {
      muid: "abjhasreess-3@mulearn",
      full_name: "ABJHASREE S S",
    },
    {
      muid: "rojithaabdulla@mulearn",
      full_name: "Rojitha Abdulla",
    },
    {
      muid: "josetomtharappel@mulearn",
      full_name: "Jose Tom",
    },
    {
      muid: "priyamariamraju@mulearn",
      full_name: "Priya Mariam Raju",
    },
    {
      muid: "lordsondevasia@mulearn",
      full_name: "Lordson Devasia",
    },
    {
      muid: "desnyantony@mulearn",
      full_name: "Desny Antony",
    },
    {
      muid: "abhijithkrishnaj@mulearn",
      full_name: "Abhijith Krishna J",
    },
    {
      muid: "anilkumarkk@mulearn",
      full_name: "Anilkumar K K",
    },
    {
      muid: "anuvarghese@mulearn",
      full_name: "Anu Varghese",
    },
    {
      muid: "sunithas@mulearn",
      full_name: "Sunitha S",
    },
    {
      muid: "aswathyal@mulearn",
      full_name: "Aswathy A L",
    },
    {
      muid: "nahanrahman-2@mulearn",
      full_name: "Nahan Rahman",
    },
    {
      muid: "sudhishr@mulearn",
      full_name: "Sudhish R",
    },
    {
      muid: "deepusajeev@mulearn",
      full_name: "DEEPU SAJEEV",
    },
    {
      muid: "lathikaksudhi@mulearn",
      full_name: "LATHIKA k Sudhi",
    },
    {
      muid: "nandur@mulearn",
      full_name: "NANDU R",
    },
    {
      muid: "nakulrajkr@mulearn",
      full_name: "Nakulraj K R",
    },
    {
      muid: "roshandavid@mulearn",
      full_name: "Roshan David",
    },
    {
      muid: "reshmav.k@mulearn",
      full_name: "RESHMA V.K",
    },
    {
      muid: "merlingeorge@mulearn",
      full_name: "MERLIN GEORGE",
    },
    {
      muid: "sangeethasagar-1@mulearn",
      full_name: "SANGEETHA SAGAR",
    },
    {
      muid: "renethajb-1@mulearn",
      full_name: "Renetha JB",
    },
  ],
};
