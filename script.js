// ---------- the buddies ----------
const PETS = [
  { id: 'cat',   emoji: '🐱', name: 'Mochi',   vibe: 'calm & cozy',  sound: 'purrr~' },
  { id: 'dog',   emoji: '🐶', name: 'Biscuit', vibe: 'your hype pup', sound: 'woof woof!' },
  { id: 'bunny', emoji: '🐰', name: 'Clover',  vibe: 'soft & gentle', sound: '*happy hop*' },
  { id: 'bear',  emoji: '🐻', name: 'Honey',   vibe: 'big warm hugs', sound: '*bear hug*' },
];

// ---------- the rules ----------
// each rule: keywords to look for, and a few replies to pick from.
// {name} and {sound} get swapped for the buddy's name and sound.
const RULES = [
  {
    keys: ['hi', 'hello', 'hey', 'hii', 'yo', 'morning'],
    replies: [
      "hiii! I'm so happy you're here 💕 how are you feeling today?",
      "{sound} hello friend! how's your heart doing today?",
    ],
  },
  {
    keys: ['sad', 'down', 'cry', 'crying', 'upset', 'blue', 'hurt',
           'not good', 'not great', 'not okay', 'not ok', 'not happy', 'bad'],
    replies: [
      "I'm sorry you're feeling sad 🥺 your feelings are allowed to be here. want to tell me what happened?",
      "sending you the softest hug 🫂 sad days don't last forever, and you don't have to be okay right now.",
      "{sound} I'm right here with you. you can pet me if it helps 💗",
    ],
  },
  {
    keys: ['anxious', 'anxiety', 'nervous', 'worried', 'worry', 'scared', 'panic'],
    replies: [
      "let's breathe together 🌬️\nin for 4... hold for 4... out for 6.\nyou're safe right now, and you're doing great.",
      "worry is just your brain trying to protect you 💭 name 3 things you can see right now. I'll wait 💕",
    ],
  },
  {
    keys: ['stressed', 'stress', 'overwhelmed', 'busy', 'too much', 'pressure'],
    replies: [
      "that sounds like a lot 😮‍💨 what's ONE tiny thing you could do next? just one. the rest can wait.",
      "you don't have to do it all today 🌷 rest is productive too.",
    ],
  },
  {
    keys: ['tired', 'exhausted', 'sleepy', 'drained', 'burnt out', 'burnout'],
    replies: [
      "your body is asking for kindness 😴 maybe some water, a snack, or a little nap?",
      "{sound} even buddies need naps. you're allowed to rest without earning it 💤",
    ],
  },
  {
    keys: ['lonely', 'alone', 'nobody', 'no one', 'isolated'],
    replies: [
      "feeling lonely is so hard 💗 is there one person you could send a little 'thinking of you' text to?",
      "you matter more than you know 🌸 I'm here, and the people who love you are just a message away.",
    ],
  },
  {
    keys: ['ugly', 'stupid', 'hate myself', 'not good enough', 'failure', 'worthless', 'dumb'],
    replies: [
      "hey, be gentle with my friend! 🥺 you'd never talk to someone you love like that. you deserve that same kindness.",
      "you are not your worst moment 💕 you're learning, growing, and trying. that's more than enough.",
    ],
  },
  {
    keys: ['happy', 'good', 'great', 'excited', 'amazing', 'yay', 'proud'],
    replies: [
      "YAY!! 🎉 that makes me so happy! tell me everything!",
      "{sound} I love this energy! you deserve all the good things ✨",
    ],
  },
  {
    keys: ['affirmation', 'motivate', 'motivation', 'encourage', 'pep talk', 'cheer'],
    replies: [
      "✨ today's affirmation ✨\n\"I am worthy of love, rest, and good things.\"",
      "✨ today's affirmation ✨\n\"I don't have to be perfect to be proud of myself.\"",
      "✨ today's affirmation ✨\n\"I am doing my best, and my best is enough.\"",
      "✨ today's affirmation ✨\n\"I am allowed to take up space.\"",
    ],
  },
  {
    keys: ['thank', 'thanks', 'ty', 'love you', 'ily'],
    replies: [
      "aww 🥹 I'm always here for you. {sound}",
      "thank YOU for taking care of yourself today 💕",
    ],
  },
  {
    keys: ['bye', 'goodnight', 'night', 'gtg', 'later'],
    replies: [
      "bye bye! remember: you're doing better than you think 🌙💕",
      "{sound} come back anytime. I'll be right here!",
    ],
  },
];

const FALLBACK = [
  "I'm listening 💕 tell me more?",
  "hmm, I'm a little buddy so I don't know every word yet 🥺 are you feeling happy, sad, stressed, or tired?",
  "{sound} whatever it is, I'm proud of you for sharing it.",
];

// a safety rule that always wins: point people to real humans
const CRISIS_KEYS = ['kill myself', 'suicide', 'end it all', 'want to die', 'hurt myself', 'self harm'];
const CRISIS_REPLY =
  "I care about you so much, and this is bigger than a little buddy can help with 💗\n" +
  "please reach out to someone right now. in the US you can call or text 988 (Suicide & Crisis Lifeline), any time.\n" +
  "you deserve real support, and people want to help you.";

const PET_LINES = [
  "{sound}", "hehe that tickles!", "more pets pls 🥺", "you're the best human 💕",
  "*melts*", "I feel so loved!", "✨ happiness +1 ✨",
];

const CHIPS = ["I'm sad 🥺", "I'm stressed 😮‍💨", "I'm tired 😴", "I'm happy! 🎉", "affirmation pls ✨"];

// ---------- app ----------
const $ = id => document.getElementById(id);
let pet = null;
let pets = 0;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(text) {
  return text.replace(/\{name\}/g, pet.name).replace(/\{sound\}/g, pet.sound);
}

// find the best reply for what the user typed
function getReply(text) {
  const t = ' ' + text.toLowerCase().replace(/[^a-z\s']/g, ' ') + ' ';

  if (CRISIS_KEYS.some(k => t.includes(k))) return CRISIS_REPLY;

  // "not feeling good" or "don't feel great" means sad, not happy
  if (/\b(not|dont|don't|never|isn't|isnt)\b.*\b(good|great|happy|okay|ok|amazing)\b/.test(t)) {
    return fill(pick(RULES[1].replies));
  }

  for (const rule of RULES) {
    // match whole words so "hi" doesn't fire on "this"
    if (rule.keys.some(k => t.includes(' ' + k + ' '))) {
      return fill(pick(rule.replies));
    }
  }
  return fill(pick(FALLBACK));
}

function addMessage(text, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  $('messages').appendChild(div);
  $('messages').scrollTop = $('messages').scrollHeight;
  return div;
}

function botSay(text) {
  const typing = addMessage('', 'bot');
  typing.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  setTimeout(() => {
    typing.textContent = text;
    $('messages').scrollTop = $('messages').scrollHeight;
  }, 700 + Math.random() * 500);
}

function send(text) {
  text = text.trim();
  if (!text) return;
  addMessage(text, 'user');
  botSay(getReply(text));
}

function choosePet(p) {
  pet = p;
  pets = 0;
  $('petCount').textContent = '0';
  $('buddyFace').textContent = p.emoji;
  $('buddyName').textContent = p.name;
  $('messages').innerHTML = '';
  $('pickScreen').classList.add('hidden');
  $('chatScreen').classList.remove('hidden');
  botSay(fill("hi! I'm {name} {sound} I'm here to cheer you on. how are you feeling?"));
}

function petBuddy(e) {
  pets++;
  $('petCount').textContent = pets;

  const b = $('buddy');
  b.classList.remove('petted');
  void b.offsetWidth; // restart the squish animation
  b.classList.add('petted');

  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = pick(['💕', '💖', '💗', '✨', '🌸']);
  heart.style.left = 20 + Math.random() * 30 + 'px';
  heart.style.top = '0px';
  b.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);

  // every 5 pets, the buddy says something sweet
  if (pets % 5 === 0) botSay(fill(pick(PET_LINES)));
}

// ---------- build the page ----------
PETS.forEach(p => {
  const btn = document.createElement('button');
  btn.className = 'pet-option';
  btn.innerHTML =
    '<span class="emoji">' + p.emoji + '</span>' +
    '<span class="name">' + p.name + '</span>' +
    '<span class="vibe">' + p.vibe + '</span>';
  btn.addEventListener('click', () => choosePet(p));
  $('petChoices').appendChild(btn);
});

CHIPS.forEach(c => {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.textContent = c;
  chip.addEventListener('click', () => send(c));
  $('chips').appendChild(chip);
});

$('buddy').addEventListener('click', petBuddy);
$('backBtn').addEventListener('click', () => {
  $('chatScreen').classList.add('hidden');
  $('pickScreen').classList.remove('hidden');
});
$('composer').addEventListener('submit', e => {
  e.preventDefault();
  send($('input').value);
  $('input').value = '';
});
