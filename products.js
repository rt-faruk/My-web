// Ekhane category ar package gulo bodlan. Dam gulo namuna, apnar nijer dam boshan.
const SHOP = {
  name: "আপনার শপ",
  whatsapp: "8801XXXXXXXXX",   // country code shoho, + chara
  telegram: "https://t.me/yourchannel",
  payNumbers: {
    bKash: "01XXXXXXXXX",
    Nagad: "01XXXXXXXXX",
    Rocket: "01XXXXXXXXX"
  }
};

const CATEGORIES = [
  {
    id: "uid-topup",
    title: "UID Top Up",
    note: "শুধু প্লেয়ার UID দিন, পাসওয়ার্ড লাগবে না।",
    packages: [
      { id: "d25",  name: "25 Diamonds",  price: 22 },
      { id: "d115", name: "115 Diamonds", price: 85 },
      { id: "d240", name: "240 Diamonds", price: 160 },
      { id: "d355", name: "355 Diamonds", price: 240 },
      { id: "d610", name: "610 Diamonds", price: 400 },
      { id: "d1240", name: "1240 Diamonds", price: 790 }
    ]
  },
  {
    id: "membership",
    title: "Weekly / Monthly",
    note: "সাপ্তাহিক ও মাসিক মেম্বারশিপ।",
    packages: [
      { id: "weekly",  name: "Weekly",  price: 155 },
      { id: "monthly", name: "Monthly", price: 770 }
    ]
  },
  {
    id: "levelup",
    title: "Level Up Pass",
    note: "লেভেল আপ পাস অর্ডার করুন।",
    packages: [
      { id: "lv1", name: "Level Up Pass", price: 150 }
    ]
  },
  {
    id: "like",
    title: "Likes",
    note: "প্রোফাইল লাইক।",
    packages: [
      { id: "l100", name: "100 Likes", price: 12 },
      { id: "l200", name: "200 Likes", price: 22 }
    ]
  }
];
