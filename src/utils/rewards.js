/* ═══════════════════════════════════════════════════════════════
   REWARD SYSTEM — 365日間、毎日1つ解放
   ─────────────────────────────────────────────────────────────
   ポケモン     : 10日ごと（day 10, 20, 30 ... 360）計36体
   称号/背景/フレーム/アクセ/スタンプ : 残り329日を埋める
   エフェクト   : 31日サイクルごとに1つ（計10回）
   各日にかぶりなし・ミステリーロック
   perfect専用  : 別枠（streak日数と独立）
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   ポケモン定義
   ・スタート    : day 0（ピチュー）
   ・序盤ボーナス: day 1〜10（毎日1体・各地方）
   ・7日サイクル : day 17, 24, 31, 38 … 360（7日ごと）
   ・節目ボーナス: day 30,50,70,100,120,150,180,200,250,300,350
                  （7日サイクルとは別・伝説・レア）
   ・perfect専用 : 別枠
───────────────────────────────────────────────────────────── */

// [id, pokeId, name, day]
const POKE_STARTER = ['pichu', 172, 'ピチュー', 0]

// ── 序盤ボーナス（day 1〜10 / 毎日・各地方スターター系）
const POKE_EARLY = [
  ['togepi',     175, 'タマゴラス',  1],  // ジョウト
  ['marill',     183, 'マリル',      2],  // ジョウト
  ['mudkip',     258, 'ミズゴロウ',  3],  // ホウエン
  ['piplup',     393, 'ポッチャマ',  4],  // シンオウ
  ['oshawott',   501, 'ミジュマル',  5],  // イッシュ
  ['fennekin',   653, 'フォッコ',    6],  // カロス
  ['rowlet',     722, 'モクロー',    7],  // アローラ
  ['sobble',     816, 'メッソン',    8],  // ガラル
  ['sprigatito', 906, 'ニャオハ',    9],  // パルデア
  ['mimikyu',    778, 'ミミッキュ', 10],  // アローラ（人気）
]

// ── 節目ボーナス（特別な日・伝説系 / 7日サイクルとは独立）
const POKE_MILESTONE = [
  ['eevee',     133, 'イーブイ',     30],  // 1ヶ月（進化の可能性）
  ['charizard',   6, 'リザードン',   50],  // 50日（カントーエース）
  ['mewtwo',    150, 'ミュウツー',   70],  // 70日（伝説）
  ['lugia',     249, 'ルギア',      100],  // 100日（伝説）
  ['ho_oh',     250, 'ホウオウ',    120],  // 120日（伝説）
  ['rayquaza',  384, 'レックウザ',  150],  // 150日（伝説）
  ['arceus',    493, 'アルセウス',  180],  // 180日（神）
  ['zacian',    888, 'ザシアン',    200],  // 200日（ガラル伝説）
  ['koraidon', 1007, 'コライドン',  250],  // 250日（パルデア伝説）
  ['miraidon', 1008, 'ミライドン',  300],  // 300日（パルデア伝説）
  ['dialga',    483, 'ディアルガ',  350],  // 350日（時の神）
]

// ── 7日サイクル（day 17, 24, 31 … / 節目と重なる日はスキップ）
// 節目の日セット
const _milestoneDays = new Set([30,50,70,100,120,150,180,200,250,300,350])
// day 17 から7日ごと、365日以内・節目除外 → 対象日を計算
const _sevenDays = (() => {
  const days = []
  for (let d = 17; d <= 365; d += 7) {
    if (!_milestoneDays.has(d)) days.push(d)
  }
  return days
})()
// _sevenDays の長さ分のポケモンを各地方から配置
const POKE_7DAY_LIST = [
  // カントー
  ['pikachu',    25,  'ピカチュウ' ],
  ['raichu',     26,  'ライチュウ' ],
  ['gengar',     94,  'ゲンガー'   ],
  ['alakazam',   65,  'フーディン' ],
  ['gyarados',  130,  'ギャラドス' ],
  ['snorlax',   143,  'カビゴン'   ],
  ['dragonite', 149,  'カイリュー' ],
  ['vaporeon',  134,  'シャワーズ' ],
  ['jolteon',   135,  'サンダース' ],
  ['flareon',   136,  'ブースター' ],
  // ジョウト
  ['ampharos',  181,  'デンリュウ' ],
  ['espeon',    196,  'エーフィ'   ],
  ['umbreon',   197,  'ブラッキー' ],
  ['scizor',    212,  'ハッサム'   ],
  ['heracross', 214,  'ヘラクロス' ],
  ['tyranitar', 248,  'バンギラス' ],
  // ホウエン
  ['blaziken',  257,  'バシャーモ' ],
  ['gardevoir', 282,  'サーナイト' ],
  ['absol',     359,  'アブソル'   ],
  ['metagross', 376,  'メタグロス' ],
  // シンオウ
  ['lucario',   448,  'ルカリオ'   ],
  ['garchomp',  445,  'ガブリアス' ],
  ['leafeon',   470,  'リーフィア' ],
  ['glaceon',   471,  'グレイシア' ],
  ['giratina',  487,  'ギラティナ' ],
  ['rotom',     479,  'ロトム'     ],
  // イッシュ
  ['zoroark',   571,  'ゾロアーク' ],
  ['hydreigon', 635,  'サザンドラ' ],
  ['zekrom',    644,  'ゼクロム'   ],
  ['reshiram',  643,  'レシラム'   ],
  // カロス
  ['greninja',  658,  'ゲッコウガ' ],
  ['aegislash', 681,  'ギルガルド' ],
  ['sylveon',   700,  'ニンフィア' ],
  ['goodra',    706,  'ヌメルゴン' ],
  // アローラ
  ['decidueye', 724,  'ジュナイパー'],
  ['incineroar',727,  'ガオガエン'  ],
  ['primarina', 730,  'アシレーヌ'  ],
  ['lycanroc',  745,  'ルガルガン'  ],
  // ガラル
  ['toxtricity',849,  'ストリンダー'],
  ['dragapult', 887,  'ドラパルト'  ],
  ['zamazenta', 889,  'ザマゼンタ'  ],
  ['calyrex',   898,  'バドレックス' ],
  // パルデア（最新）
  ['meowscarada',908, 'マスカーニャ' ],
  ['skeledirge', 911, 'ラウドボーン' ],
  ['quaquaval',  914, 'ウェーニバル' ],
  ['tinkaton',   959, 'デカヌチャン' ],
  ['palafin',    964, 'イルカマン'   ],
  ['kingambit',  983, 'セグレイブ'   ],  // (#983はセグレイブ)
  ['gholdengo', 1000, 'サーフゴー'   ],
  ['iron_valiant',1006,'アイアンバンデ'],
  ['roaring_moon',1005,'スコヴィラン' ], // Roaring Moon = 1005
]
// 7日サイクルにポケモンを割り当て（日付付き）
const POKE_7DAY = _sevenDays.map((day, i) => [
  POKE_7DAY_LIST[i % POKE_7DAY_LIST.length][0],
  POKE_7DAY_LIST[i % POKE_7DAY_LIST.length][1],
  POKE_7DAY_LIST[i % POKE_7DAY_LIST.length][2],
  day,
])

// ── perfect専用
const POKE_PERFECT = [
  ['celebi',   251, 'セレビィ',    5 ],  // ジョウト幻
  ['jirachi',  385, 'ジラーチ',   10 ],  // ホウエン幻
  ['mew',      151, 'ミュウ',      20 ],  // カントー幻
  ['victini',  494, 'ビクティニ',  30 ],  // イッシュ幻
  ['zarude',   893, 'ザルード',    50 ],  // ガラル幻
]

/* ─────────────────────────────────────────────────────────────
   エフェクト定義（10種、CSSクラス使用）
───────────────────────────────────────────────────────────── */
const EFFECTS = [
  ['pulse',     'パルス',          'effect-pulse'    ],
  ['gold-glow', 'ゴールドグロー',  'effect-gold-glow'],
  ['silver',    'シルバーシマー',  'effect-silver'   ],
  ['fire-aura', '炎オーラ',        'effect-fire-aura'],
  ['ice-aura',  'アイスオーラ',    'effect-ice-aura' ],
  ['rainbow',   'レインボー',      'effect-rainbow'  ],
  ['sparkle',   'キラキラ',        'effect-sparkle'  ],
  ['lightning', '雷エフェクト',    'effect-lightning'],
  ['legendary', 'レジェンダリー',  'effect-legendary'],
  ['none2',     '白光',            'effect-white'    ],
]

/* ─────────────────────────────────────────────────────────────
   称号（72種）
───────────────────────────────────────────────────────────── */
const TITLES_RAW = [
  // [id, label, color]
  ['t01','始動者','#84A98C'],         ['t02','火花','#FF9800'],
  ['t03','三日の勇者','#E8813A'],     ['t04','動き出した魂','#6C63FF'],
  ['t05','一週間の戦士','#2196F3'],   ['t06','意志の炎','#FF5722'],
  ['t07','静かな決意','#009688'],     ['t08','自分を信じる者','#4CAF50'],
  ['t09','十日の継続者','#8BC34A'],   ['t10','習慣の芽','#CDDC39'],
  ['t11','揺るぎない者','#FFC107'],   ['t12','努力の使徒','#FF9800'],
  ['t13','二週間の覚悟','#FF5722'],   ['t14','自己投資家','#9C27B0'],
  ['t15','朝型の戦士','#2196F3'],     ['t16','記録の守護者','#00BCD4'],
  ['t17','三週間の挑戦者','#009688'], ['t18','習慣の建築家','#4CAF50'],
  ['t19','変化する者','#8BC34A'],     ['t20','静かなる強者','#FFC107'],
  ['t21','一ヶ月の誓い','#FFD700'],   ['t22','黎明の士','#FF9800'],
  ['t23','継続の鬼','#FF5722'],       ['t24','鋼の意志','#9E9E9E'],
  ['t25','自分革命','#9C27B0'],       ['t26','覚醒の者','#673AB7'],
  ['t27','不動の心','#2196F3'],       ['t28','光の使者','#FFEB3B'],
  ['t29','昇華する者','#00BCD4'],     ['t30','習慣の達人','#4CAF50'],
  ['t31','40日の鋼鉄','#F44336'],     ['t32','継続の魔法使い','#9C27B0'],
  ['t33','静かな炎','#FF9800'],       ['t34','鉄の習慣','#607D8B'],
  ['t35','50日の伝説','#FF5722'],     ['t36','自分との約束','#E91E63'],
  ['t37','揺れない魂','#3F51B5'],     ['t38','光を求める者','#FFEB3B'],
  ['t39','燃え続ける者','#FF5722'],   ['t40','本物の始まり','#4CAF50'],
  ['t41','60日の覚醒','#9C27B0'],     ['t42','習慣の化身','#673AB7'],
  ['t43','自己の王','#FFD700'],       ['t44','鬼の継続','#D32F2F'],
  ['t45','70日の証明','#E91E63'],     ['t46','内なる炎','#FF9800'],
  ['t47','魂の鍛錬','#607D8B'],       ['t48','己を超える者','#9C27B0'],
  ['t49','80日の不屈','#F44336'],     ['t50','継続の神話','#FF5722'],
  ['t51','限界の向こう側','#673AB7'], ['t52','習慣の神','#E91E63'],
  ['t53','90日の鬼神','#D32F2F'],     ['t54','自己超越者','#9C27B0'],
  ['t55','百日への誓い','#FF9800'],   ['t56','光の戦士','#FFEB3B'],
  ['t57','嵐の中心','#2196F3'],       ['t58','変革の担い手','#4CAF50'],
  ['t59','精神の武士','#607D8B'],     ['t60','百日の継続者','#FFD700'],
  ['t61','伝説の序章','#FF5722'],     ['t62','自分の英雄','#E91E63'],
  ['t63','無限の継続','#9C27B0'],     ['t64','光り輝く者','#FFEB3B'],
  ['t65','魂の炎','#FF9800'],         ['t66','揺るぎない証','#4CAF50'],
  ['t67','一年の誓い','#FFD700'],     ['t68','時を超える者','#673AB7'],
  ['t69','完全なる継続','#9C27B0'],   ['t70','己の伝説','#F44336'],
  ['t71','百日の伝説','#FFD700'],     ['t72','継続の神','#E91E63'],
]

/* ─────────────────────────────────────────────────────────────
   背景テーマ（72種）
───────────────────────────────────────────────────────────── */
const BGS_RAW = [
  // [id, label, bg]
  ['bg01','ダーク','#1A1A2E'],
  ['bg02','サンセット','linear-gradient(135deg,#FF9A9E,#FECFEF)'],
  ['bg03','オーシャン','linear-gradient(135deg,#A1C4FD,#C2E9FB)'],
  ['bg04','フォレスト','linear-gradient(135deg,#D4FC79,#96E6A1)'],
  ['bg05','サクラ','linear-gradient(135deg,#FFCCE7,#FFA8D9)'],
  ['bg06','レモン','linear-gradient(135deg,#FFF176,#FFD54F)'],
  ['bg07','ミッドナイト','linear-gradient(135deg,#0F2027,#203A43,#2C5364)'],
  ['bg08','オーロラ','linear-gradient(135deg,#00C9FF,#92FE9D)'],
  ['bg09','ボルカノ','linear-gradient(135deg,#FF416C,#FF4B2B)'],
  ['bg10','ホログラム','linear-gradient(135deg,#f6d365,#fda085)'],
  ['bg11','ギャラクシー','linear-gradient(135deg,#0F0C29,#302B63,#24243E)'],
  ['bg12','ネビュラ','linear-gradient(135deg,#4776E6,#8E54E9)'],
  ['bg13','コーラル','linear-gradient(135deg,#FF7043,#FF8A65,#FFCCBC)'],
  ['bg14','北の光','linear-gradient(135deg,#006064,#00BCD4,#80DEEA)'],
  ['bg15','コズミック','linear-gradient(135deg,#1A0533,#6A0572,#C471ED)'],
  ['bg16','レインボー','linear-gradient(135deg,#FF0000,#FF7700,#FFFF00,#00CC00,#0066FF,#8800FF)'],
  ['bg17','深淵','linear-gradient(135deg,#000000,#0D0D0D,#1A0533)'],
  ['bg18','バイオレット','linear-gradient(135deg,#4A00E0,#8E2DE2)'],
  ['bg19','ターコイズ','linear-gradient(135deg,#00B4DB,#0083B0)'],
  ['bg20','ゴールデン','linear-gradient(135deg,#F7971E,#FFD200)'],
  ['bg21','チェリー','linear-gradient(135deg,#eb3349,#f45c43)'],
  ['bg22','ミント','linear-gradient(135deg,#00b09b,#96c93d)'],
  ['bg23','ピーチ','linear-gradient(135deg,#ED213A,#93291E)'],
  ['bg24','スカイ','linear-gradient(135deg,#56CCF2,#2F80ED)'],
  ['bg25','ローズ','linear-gradient(135deg,#f953c6,#b91d73)'],
  ['bg26','サンライズ','linear-gradient(135deg,#FDC830,#F37335)'],
  ['bg27','スレート','linear-gradient(135deg,#2c3e50,#4ca1af)'],
  ['bg28','ライム','linear-gradient(135deg,#56ab2f,#a8e063)'],
  ['bg29','インディゴ','linear-gradient(135deg,#360033,#0b8793)'],
  ['bg30','アンバー','linear-gradient(135deg,#FFA17F,#00223E)'],
  ['bg31','ラベンダー','linear-gradient(135deg,#834d9b,#d04ed6)'],
  ['bg32','アクア','linear-gradient(135deg,#1a6b77,#5db8be)'],
  ['bg33','クリムゾン','linear-gradient(135deg,#642B73,#C6426E)'],
  ['bg34','スチール','linear-gradient(135deg,#485563,#29323c)'],
  ['bg35','ジェード','linear-gradient(135deg,#004d40,#00796b)'],
  ['bg36','ゴールドラッシュ','linear-gradient(135deg,#c0392b,#f39c12)'],
  ['bg37','ブルーム','linear-gradient(135deg,#09203f,#537895)'],
  ['bg38','グレープ','linear-gradient(135deg,#4b6cb7,#182848)'],
  ['bg39','コーヒー','linear-gradient(135deg,#4b3832,#854442)'],
  ['bg40','スペース','linear-gradient(135deg,#000428,#004e92)'],
  ['bg41','ピンクドリーム','linear-gradient(135deg,#ff9a9e,#fad0c4)'],
  ['bg42','グリーンフィールド','linear-gradient(135deg,#38ef7d,#11998e)'],
  ['bg43','マジックブルー','linear-gradient(135deg,#2193b0,#6dd5ed)'],
  ['bg44','ナイトスカイ','linear-gradient(135deg,#0F2027,#203A43)'],
  ['bg45','シーフォーム','linear-gradient(135deg,#43C6AC,#F8FFAE)'],
  ['bg46','ファイアーストーム','linear-gradient(135deg,#f12711,#f5af19)'],
  ['bg47','ブリリアント','linear-gradient(135deg,#12c2e9,#c471ed,#f64f59)'],
  ['bg48','デザート','linear-gradient(135deg,#FFD89B,#19547B)'],
  ['bg49','サマーナイト','linear-gradient(135deg,#1CB5E0,#000851)'],
  ['bg50','ブロッサム','linear-gradient(135deg,#fccb90,#d57eeb)'],
  ['bg51','メタリック','linear-gradient(135deg,#abbaab,#ffffff)'],
  ['bg52','ベルベット','linear-gradient(135deg,#1a1a2e,#e94560)'],
  ['bg53','パステル','linear-gradient(135deg,#a18cd1,#fbc2eb)'],
  ['bg54','ジェット','linear-gradient(135deg,#2b5876,#4e4376)'],
  ['bg55','スプリング','linear-gradient(135deg,#a1c4fd,#c2e9fb)'],
  ['bg56','マリン','linear-gradient(135deg,#0575e6,#021b79)'],
  ['bg57','サファリ','linear-gradient(135deg,#f46b45,#eea849)'],
  ['bg58','ホワイトスモーク','linear-gradient(135deg,#f5f7fa,#c3cfe2)'],
  ['bg59','スノー','linear-gradient(135deg,#e0eafc,#cfdef3)'],
  ['bg60','ブラックゴールド','linear-gradient(135deg,#FFD700,#1A1A1A)'],
  ['bg61','エメラルド','linear-gradient(135deg,#11998e,#38ef7d)'],
  ['bg62','プラム','linear-gradient(135deg,#360033,#0b8793)'],
  ['bg63','シルバームーン','linear-gradient(135deg,#C0C0C0,#1A1A2E)'],
  ['bg64','モーニンググロー','linear-gradient(135deg,#ff7e5f,#feb47b)'],
  ['bg65','ニューリーフ','linear-gradient(135deg,#76b852,#8dc26f)'],
  ['bg66','ブルーラグーン','linear-gradient(135deg,#43C6AC,#191654)'],
  ['bg67','ディープシー','linear-gradient(135deg,#003973,#e5e5be)'],
  ['bg68','ブリムストーン','linear-gradient(135deg,#232526,#414345)'],
  ['bg69','ファンシー','linear-gradient(135deg,#f093fb,#f5576c)'],
  ['bg70','ストームクラウド','linear-gradient(135deg,#373B44,#4286f4)'],
  ['bg71','ゴールデンアワー','linear-gradient(135deg,#F0CB35,#C02425)'],
  ['bg72','ドリームライン','linear-gradient(135deg,#7F00FF,#E100FF)'],
]

/* ─────────────────────────────────────────────────────────────
   フレーム（72種 / style or cssClass）
───────────────────────────────────────────────────────────── */
// [id, label, border, shadow] or [id, label, '', '', cssClass]
const FRAMES_RAW = [
  ['fr01','ゴールド',         '3px solid #FFD700','0 0 16px rgba(255,215,0,0.5)',        ''],
  ['fr02','シルバー',         '3px solid #C0C0C0','0 0 12px rgba(192,192,192,0.5)',      ''],
  ['fr03','ネオンブルー',     '3px solid #4D96FF','0 0 16px rgba(77,150,255,0.6)',       ''],
  ['fr04','パープル',         '3px solid #9C27B0','0 0 14px rgba(156,39,176,0.5)',       ''],
  ['fr05','グリーン',         '3px solid #4CAF50','0 0 12px rgba(76,175,80,0.5)',        ''],
  ['fr06','レッド',           '3px solid #F44336','0 0 14px rgba(244,67,54,0.5)',        ''],
  ['fr07','シアン',           '3px solid #00BCD4','0 0 14px rgba(0,188,212,0.5)',        ''],
  ['fr08','ピンク',           '3px solid #E91E63','0 0 14px rgba(233,30,99,0.5)',        ''],
  ['fr09','オレンジ',         '3px solid #FF9800','0 0 14px rgba(255,152,0,0.5)',        ''],
  ['fr10','ライム',           '3px solid #8BC34A','0 0 12px rgba(139,195,74,0.5)',       ''],
  ['fr11','インディゴ',       '3px solid #3F51B5','0 0 14px rgba(63,81,181,0.5)',        ''],
  ['fr12','アンバー',         '3px solid #FFC107','0 0 14px rgba(255,193,7,0.5)',        ''],
  ['fr13','ローズゴールド',   '3px solid #E8A0A0','0 0 14px rgba(232,160,160,0.5)',      ''],
  ['fr14','ディープパープル', '3px solid #673AB7','0 0 14px rgba(103,58,183,0.6)',       ''],
  ['fr15','ティール',         '3px solid #009688','0 0 12px rgba(0,150,136,0.5)',        ''],
  ['fr16','マゼンタ',         '3px solid #E040FB','0 0 16px rgba(224,64,251,0.6)',       ''],
  ['fr17','コーラル',         '3px solid #FF7043','0 0 14px rgba(255,112,67,0.5)',       ''],
  ['fr18','エメラルド',       '3px solid #00C853','0 0 14px rgba(0,200,83,0.5)',         ''],
  ['fr19','ラベンダー',       '3px solid #9575CD','0 0 12px rgba(149,117,205,0.5)',      ''],
  ['fr20','スカイブルー',     '3px solid #29B6F6','0 0 14px rgba(41,182,246,0.5)',       ''],
  ['fr21','ダークゴールド',   '3px solid #B8860B','0 0 14px rgba(184,134,11,0.5)',       ''],
  ['fr22','ネオングリーン',   '3px solid #76FF03','0 0 18px rgba(118,255,3,0.7)',        ''],
  ['fr23','ネオンピンク',     '3px solid #FF4081','0 0 18px rgba(255,64,129,0.7)',       ''],
  ['fr24','アクア',           '3px solid #00E5FF','0 0 16px rgba(0,229,255,0.6)',        ''],
  ['fr25','ブロンズ',         '3px solid #CD7F32','0 0 12px rgba(205,127,50,0.5)',       ''],
  ['fr26','プラチナ',         '3px solid #E8E8E8','0 0 16px rgba(232,232,232,0.7)',      ''],
  ['fr27','ルビー',           '3px solid #E0115F','0 0 16px rgba(224,17,95,0.6)',        ''],
  ['fr28','サファイア',       '3px solid #0F52BA','0 0 16px rgba(15,82,186,0.6)',        ''],
  ['fr29','エメラルド2',      '3px solid #50C878','0 0 16px rgba(80,200,120,0.6)',       ''],
  ['fr30','アメジスト',       '3px solid #9966CC','0 0 14px rgba(153,102,204,0.6)',      ''],
  ['fr31','トパーズ',         '3px solid #FFC87C','0 0 14px rgba(255,200,124,0.5)',      ''],
  ['fr32','オパール',         '3px solid #A8C5DA','0 0 14px rgba(168,197,218,0.6)',      ''],
  ['fr33','ダブルゴールド',   '4px solid #FFD700','0 0 20px rgba(255,215,0,0.6)',        ''],
  ['fr34','ダブルシルバー',   '4px solid #C0C0C0','0 0 18px rgba(192,192,192,0.6)',      ''],
  ['fr35','ホワイト',         '3px solid #FFFFFF','0 0 14px rgba(255,255,255,0.8)',      ''],
  ['fr36','ブラック',         '3px solid #212121','0 0 14px rgba(0,0,0,0.8)',            ''],
  ['fr37','ネオンイエロー',   '3px solid #FFD600','0 0 20px rgba(255,214,0,0.8)',        ''],
  ['fr38','ネオンオレンジ',   '3px solid #FF6D00','0 0 20px rgba(255,109,0,0.8)',        ''],
  ['fr39','ネオンシアン',     '3px solid #00E5FF','0 0 20px rgba(0,229,255,0.8)',        ''],
  ['fr40','ネオンパープル',   '3px solid #D500F9','0 0 20px rgba(213,0,249,0.8)',        ''],
  ['fr41','ライトブルー',     '3px solid #81D4FA','0 0 12px rgba(129,212,250,0.5)',      ''],
  ['fr42','ライトグリーン',   '3px solid #A5D6A7','0 0 12px rgba(165,214,167,0.5)',      ''],
  ['fr43','ライトピンク',     '3px solid #F48FB1','0 0 12px rgba(244,143,177,0.5)',      ''],
  ['fr44','ライトパープル',   '3px solid #CE93D8','0 0 12px rgba(206,147,216,0.5)',      ''],
  ['fr45','ディープブルー',   '3px solid #1565C0','0 0 16px rgba(21,101,192,0.6)',       ''],
  ['fr46','ディープグリーン', '3px solid #2E7D32','0 0 16px rgba(46,125,50,0.6)',        ''],
  ['fr47','ディープレッド',   '3px solid #B71C1C','0 0 16px rgba(183,28,28,0.6)',        ''],
  ['fr48','ディープオレンジ', '3px solid #E65100','0 0 16px rgba(230,81,0,0.6)',         ''],
  ['fr49','スターダスト',     '2px solid #C8A2C8','0 0 12px rgba(200,162,200,0.5)',      ''],
  ['fr50','ミスティック',     '3px solid #80DEEA','0 0 14px rgba(128,222,234,0.6)',      ''],
  ['fr51','ダークティール',   '3px solid #00695C','0 0 14px rgba(0,105,92,0.6)',         ''],
  ['fr52','ウォームイエロー', '3px solid #F9A825','0 0 12px rgba(249,168,37,0.5)',       ''],
  ['fr53','クールグレー',     '3px solid #78909C','0 0 10px rgba(120,144,156,0.4)',      ''],
  ['fr54','ペールゴールド',   '3px solid #EAD87C','0 0 12px rgba(234,216,124,0.5)',      ''],
  ['fr55','バイオレット',     '3px solid #6200EA','0 0 16px rgba(98,0,234,0.6)',         ''],
  ['fr56','ホットピンク',     '3px solid #F50057','0 0 18px rgba(245,0,87,0.7)',         ''],
  ['fr57','エレクトリック',   '3px solid #FFEA00','0 0 20px rgba(255,234,0,0.8)',        ''],
  ['fr58','フロスト',         '3px solid #E0F7FA','0 0 12px rgba(224,247,250,0.8)',      ''],
  ['fr59','マーブル',         '3px solid #EFEBE9','0 0 10px rgba(239,235,233,0.6)',      ''],
  ['fr60','ジュエル',         '3px solid #00BFA5','0 0 16px rgba(0,191,165,0.6)',        ''],
  // アニメ系（cssClass使用）
  ['fr61','炎',               '','','frame-fire'],
  ['fr62','レインボー',       '','','frame-rainbow'],
  ['fr63','ギャラクシー',     '','','frame-galaxy'],
  ['fr64','オーロラ',         '','','frame-aurora'],
  ['fr65','ダイヤモンド',     '','','frame-diamond'],
  ['fr66','ホログラフィック', '','','frame-holo'],
  ['fr67','マグマ',           '','','frame-lava'],
  ['fr68','オーシャン',       '','','frame-ocean'],
  ['fr69','ネビュラ',         '','','frame-nebula'],
  ['fr70','サンダー',         '','','frame-thunder'],
  ['fr71','レジェンダリー',   '','','frame-legendary'],
  ['fr72','神',               '','','frame-godlike'],
]

/* ─────────────────────────────────────────────────────────────
   アクセサリー（72種）
───────────────────────────────────────────────────────────── */
// [id, label, emoji, pos]
// pos: 't'=top / 'tr'=top-right / 'br'=bottom-right / 'bl'=bottom-left / 'tc'=top-center / 'bc'=bottom-center
const ACCS_RAW = [
  ['ac01','王冠','👑','tc'],   ['ac02','雷','⚡','tr'],    ['ac03','炎','🔥','br'],
  ['ac04','星','🌟','tr'],     ['ac05','リボン','🎀','bl'], ['ac06','ダイヤ','💎','tl'],
  ['ac07','シールド','🛡️','bl'],['ac08','ソード','⚔️','tr'],['ac09','トロフィー','🏆','br'],
  ['ac10','ジェム','💠','tc'],  ['ac11','翼','🪽','bc'],    ['ac12','∞','♾️','tl'],
  ['ac13','ドラゴン','🐉','tr'],['ac14','天使','😇','tc'],  ['ac15','宇宙','🌌','br'],
  ['ac16','花','🌸','tc'],     ['ac17','月','🌙','tr'],     ['ac18','太陽','☀️','tl'],
  ['ac19','虹','🌈','tc'],     ['ac20','雪','❄️','tr'],     ['ac21','稲妻','⚡','tl'],
  ['ac22','ハート','❤️','tc'], ['ac23','紫ハート','💜','tr'],['ac24','青ハート','💙','tl'],
  ['ac25','金ハート','🧡','br'],['ac26','音符','🎵','tr'],  ['ac27','ギター','🎸','bl'],
  ['ac28','マイク','🎤','tr'],  ['ac29','バラ','🌹','tc'],   ['ac30','向日葵','🌻','tr'],
  ['ac31','桜','🌺','tc'],     ['ac32','葉','🍃','tl'],     ['ac33','竹','🎋','tr'],
  ['ac34','富士山','🗻','bc'],  ['ac35','剣','🗡️','tr'],    ['ac36','弓矢','🏹','tr'],
  ['ac37','盾','🔰','tc'],     ['ac38','鍵','🗝️','bl'],    ['ac39','宝石','💍','tr'],
  ['ac40','時計','⌚','bl'],    ['ac41','電球','💡','tc'],   ['ac42','炎2','🕯️','bl'],
  ['ac43','水晶','🔮','tc'],   ['ac44','本','📚','bl'],     ['ac45','ペン','✒️','tr'],
  ['ac46','目','👁️','tc'],    ['ac47','脳','🧠','tc'],     ['ac48','心','🫀','tc'],
  ['ac49','拳','👊','tr'],     ['ac50','手','🖐️','tr'],    ['ac51','目標','🎯','tr'],
  ['ac52','ロケット','🚀','tc'],['ac53','惑星','🪐','tr'],  ['ac54','彗星','☄️','tr'],
  ['ac55','花火','🎆','tc'],   ['ac56','プレゼント','🎁','br'],['ac57','カップ','🥇','tc'],
  ['ac58','旗','🏴','tl'],     ['ac59','稲光','🌩️','tc'],  ['ac60','波','🌊','bc'],
  ['ac61','魂','👻','tr'],     ['ac62','精霊','🧚','tc'],   ['ac63','鳳凰','🦅','tc'],
  ['ac64','虎','🐯','tr'],     ['ac65','狼','🐺','bl'],     ['ac66','龍','🐲','tr'],
  ['ac67','猫','🐱','tc'],     ['ac68','ロブスター','🦞','bl'],['ac69','熊','🐻','br'],
  ['ac70','ライオン','🦁','tr'],['ac71','鷹','🦅','tc'],   ['ac72','蝶','🦋','tc'],
]

const ACC_POS = {
  tc: {top:'-16px',left:'50%',transform:'translateX(-50%)'},
  tr: {top:'-10px',right:'-12px'},
  tl: {top:'-10px',left:'-8px'},
  br: {bottom:'-10px',right:'-10px'},
  bl: {bottom:'-10px',left:'-8px'},
  bc: {bottom:'-12px',left:'50%',transform:'translateX(-50%)'},
}

/* ─────────────────────────────────────────────────────────────
   スタンプ（40種 / カード左下に表示される小バッジ）
───────────────────────────────────────────────────────────── */
// [id, label, emoji, bg]
const STAMPS_RAW = [
  ['st01','初心','🌱','#84A98C'], ['st02','挑戦','⚡','#FFC107'],
  ['st03','炎上','🔥','#FF5722'], ['st04','流水','💧','#2196F3'],
  ['st05','大地','🌍','#795548'], ['st06','光明','✨','#FFD700'],
  ['st07','疾風','💨','#B0BEC5'], ['st08','岩石','🪨','#607D8B'],
  ['st09','桜花','🌸','#F48FB1'], ['st10','翠嵐','🌿','#4CAF50'],
  ['st11','月光','🌙','#9C27B0'], ['st12','太陽','☀️','#FF9800'],
  ['st13','雷鳴','⛈️','#3F51B5'], ['st14','吹雪','❄️','#00BCD4'],
  ['st15','爆炎','💥','#F44336'], ['st16','竜巻','🌀','#00ACC1'],
  ['st17','鉄壁','🛡️','#546E7A'], ['st18','鋭刃','⚔️','#78909C'],
  ['st19','黄金','💛','#F9A825'], ['st20','銀河','🌌','#311B92'],
  ['st21','進化','🔄','#8BC34A'], ['st22','覚醒','👁️','#9C27B0'],
  ['st23','限界突破','💫','#E91E63'], ['st24','不動','⛩️','#5D4037'],
  ['st25','神速','🏃','#FF6F00'], ['st26','剛力','💪','#E64A19'],
  ['st27','知恵','📖','#0097A7'], ['st28','勇気','🦁','#FF8F00'],
  ['st29','誠実','🤝','#388E3C'], ['st30','情熱','❤️‍🔥','#C62828'],
  ['st31','超越','✴️','#7B1FA2'], ['st32','伝説','🏆','#F57F17'],
  ['st33','神話','🌟','#FF6D00'], ['st34','永遠','♾️','#1565C0'],
  ['st35','天命','🌈','#00695C'], ['st36','龍魂','🐉','#6A1B9A'],
  ['st37','不死','🦅','#558B2F'], ['st38','最強','👊','#B71C1C'],
  ['st39','英雄','🎖️','#E65100'], ['st40','神','⭐','#1A237E'],
]

/* ─────────────────────────────────────────────────────────────
   称号（perfect専用）
───────────────────────────────────────────────────────────── */
const PERFECT_TITLES = [
  ['pt01','完璧主義者','#52B788',1],
  ['pt02','完璧の使徒','#F06292',5],
  ['pt03','完全燃焼',  '#AB47BC',10,true],
  ['pt04','完璧の神',  '#FFD700',20,true],
  ['pt05','完全体',    '#FF4081',50,true],
]

/* ═══════════════════════════════════════════════════════════════
   TIMELINE 自動生成
═══════════════════════════════════════════════════════════════ */

// ─── 変換ヘルパー ───
const toTitles  = () => TITLES_RAW.map(([id,label,color]) => ({ id, label, color, type:'title' }))
const toBgs     = () => BGS_RAW.map(([id,label,bg]) => ({ id, label, bg, type:'bg' }))
const toFrames  = () => FRAMES_RAW.map(([id,label,border,shadow,cssClass]) => ({
  id, label, type:'frame',
  ...(cssClass ? { cssClass } : { style:{ border, boxShadow:shadow } })
}))
const toAccs    = () => ACCS_RAW.map(([id,label,emoji,posKey]) => ({ id, label, emoji, pos: ACC_POS[posKey]||{}, type:'acc' }))
const toStamps  = () => STAMPS_RAW.map(([id,label,emoji,bg]) => ({ id, label, emoji, stampBg:bg, type:'stamp' }))
const toEffects = () => EFFECTS.map(([id,label,cssClass]) => ({ id, label, cssClass, type:'effect' }))
// isBonus: 節目ボーナスポケモンのフラグ
const mkPoke = ([id,pokeId,name,day], isBonus=false) =>
  ({ id, pokeId, name, type:'pokemon', day, isBonus })

// 序盤ボーナス（day 1〜10 の追加報酬 / ポケモンと同日に解放）
const EARLY_BONUSES = [
  { id:'eb01', type:'stamp', emoji:'🌱', stampBg:'#84A98C',                                        name:'序盤の芽', label:'序盤の芽', day:1  },
  { id:'eb02', type:'title', label:'始動者',  color:'#84A98C',                                      name:'始動者',   day:2  },
  { id:'eb03', type:'acc',   emoji:'⭐', pos:ACC_POS.tr,                                             name:'スター',   label:'スター',  day:3  },
  { id:'eb04', type:'stamp', emoji:'🔥', stampBg:'linear-gradient(135deg,#FF5722,#FF9800)',           name:'一週の炎', label:'一週の炎', day:4  },
  { id:'eb05', type:'bg',    bg:'linear-gradient(135deg,#A1C4FD,#C2E9FB)',                           name:'空色',     label:'空色',    day:5  },
  { id:'eb06', type:'frame', style:{border:'2px solid #E91E63',boxShadow:'0 0 12px rgba(233,30,99,0.3)'}, name:'ピンクフレーム', label:'ピンクフレーム', day:6 },
  { id:'eb07', type:'title', label:'火花',    color:'#FF9800',                                      name:'火花',     day:7  },
  { id:'eb08', type:'acc',   emoji:'💎', pos:ACC_POS.tl,                                             name:'ダイヤ',   label:'ダイヤ',  day:8  },
  { id:'eb09', type:'stamp', emoji:'✨', stampBg:'linear-gradient(135deg,#FFD700,#FFA500)',           name:'序盤の光', label:'序盤の光', day:9  },
  { id:'eb10', type:'bg',    bg:'linear-gradient(135deg,#D4FC79,#96E6A1)',                           name:'序盤グリーン', label:'序盤グリーン', day:10 },
]

function buildTimeline() {
  const titles  = toTitles()
  const bgs     = toBgs()
  const frames  = toFrames()
  const accs    = toAccs()
  const stamps  = toStamps()
  const effects = toEffects()

  // ポケモンが存在する全日セット（通常 or ボーナス両方）
  const pokeDays = new Set([
    0,
    ...POKE_EARLY.map(p => p[3]),
    ...POKE_7DAY.map(p => p[3]),
    ...POKE_MILESTONE.map(p => p[3]),
  ])

  const timeline = []
  // day 0: スターター
  timeline.push(mkPoke(POKE_STARTER))
  // day 1〜10: 序盤ボーナス（ポケモン + ボーナス報酬）
  POKE_EARLY.forEach((p, idx) => {
    timeline.push(mkPoke(p))
    timeline.push(EARLY_BONUSES[idx]) // 同日に非ポケモン報酬も付与
  })
  // 7日サイクル
  POKE_7DAY.forEach(p => timeline.push(mkPoke(p)))
  // 節目ボーナス（isBonus=true）
  POKE_MILESTONE.forEach(p => timeline.push(mkPoke(p, true)))

  // 残り日（非ポケモン）をサイクルで埋める
  // サイクル: [title, bg, frame, acc, stamp] × 6 + effect = 31
  const cycle = []
  for (let i = 0; i < 6; i++) cycle.push('title','bg','frame','acc','stamp')
  cycle.push('effect')
  const idx = { title:0, bg:0, frame:0, acc:0, stamp:0, effect:0 }
  let cyclePos = 0

  for (let day = 1; day <= 365; day++) {
    if (pokeDays.has(day)) continue
    const type = cycle[cyclePos % cycle.length]
    cyclePos++
    const arr = { title:titles, bg:bgs, frame:frames, acc:accs, stamp:stamps, effect:effects }[type] || titles
    const item = arr[idx[type] % arr.length]
    idx[type]++
    timeline.push({ day, ...item })
  }

  return timeline.sort((a, b) => a.day - b.day)
}

export const TIMELINE = buildTimeline()

/* ─── フラットリスト（コレクション表示用）─── */
const _defaults = {
  frame:  { id:'none',    label:'デフォルト', type:'frame', style:{border:'2px solid #E8E2D8'} },
  acc:    { id:'none',    label:'なし',       type:'acc',   emoji:'', pos:{} },
  bg:     { id:'cream',   label:'クリーム',   type:'bg',    bg:'#FAFAF7' },
  title:  { id:'beginner',label:'新人',       type:'title', color:'#9A9A9A' },
  effect: { id:'none',    label:'なし',       type:'effect',cssClass:'effect-none' },
  stamp:  { id:'none',    label:'なし',       type:'stamp', emoji:'',stampBg:'transparent' },
}

function listFor(type) {
  const def   = _defaults[type]
  const items = TIMELINE.filter(r => r.type === type && r.id !== def?.id)
  return items   // デフォルト項目はコレクションに含めない
}

export const POKEMON_REWARDS = [
  mkPoke(POKE_STARTER),
  ...POKE_EARLY.map(p => mkPoke(p)),
  ...POKE_7DAY.map(p => mkPoke(p)),
  ...POKE_MILESTONE.map(p => mkPoke(p, true)),
]
export const FRAME_REWARDS     = listFor('frame')
export const ACCESSORY_REWARDS = listFor('acc')
export const BG_REWARDS        = listFor('bg')
export const TITLE_REWARDS     = [
  ...listFor('title'),
  ...PERFECT_TITLES.map(([id,label,color,pReq,rainbow]) => ({ id, label, color, rainbow, type:'title', perfectReq:pReq })),
]
export const EFFECT_REWARDS = listFor('effect')
export const STAMP_REWARDS  = listFor('stamp')

export const PERFECT_POKEMON = POKE_PERFECT.map(([id,pokeId,name,pReq]) => ({
  id, pokeId, name, type:'pokemon', day:0, perfectReq:pReq
}))

/* ─── シークレット報酬 ─── */
// 特定の行動で解放されるサプライズ報酬
export const SECRET_REWARDS = [
  // 日記10回書いたら → 隠しスタンプ
  { id:'secret_diary10', type:'stamp', emoji:'📖', stampBg:'linear-gradient(135deg,#667eea,#764ba2)',
    name:'日記マスター', label:'日記マスター', secret:true,
    unlockCondition: 'diary10', hint:'ある行動を10回続けると解放…' },
  // ガチャ30回引いたら → 隠しエフェクト
  { id:'secret_gacha30', type:'effect', cssClass:'effect-rainbow',
    name:'ガチャ中毒', label:'ガチャ中毒', secret:true,
    unlockCondition: 'gacha30', hint:'在り方ガチャを引き続けると…' },
  // EQログを7日書いたら → 隠しフレーム
  { id:'secret_eq7', type:'frame', style:{ border:'2px solid #9B59B6', boxShadow:'0 0 16px rgba(155,89,182,0.6)' },
    name:'EQ覚醒', label:'EQ覚醒', secret:true,
    unlockCondition: 'eq7', hint:'感情と向き合い続けると…' },
  // 完璧な日15回 → 超レアポケモン（ルカリオ）
  { id:'secret_perfect15', type:'pokemon', pokeId:448, name:'ルカリオ', secret:true,
    unlockCondition: 'perfect15', hint:'完璧な日を重ねると伝説が現れる…' },
  // 週次レビュー3回書いたら → 隠し称号
  { id:'secret_weekly3', type:'title', label:'振り返りの人', color:'#6C63FF',
    name:'振り返りの人', secret:true,
    unlockCondition: 'weekly3', hint:'週を丁寧に振り返ると…' },
  // ストーリー/要約を5回使ったら → 隠しポケモン（ゾロアーク）
  { id:'secret_world5', type:'pokemon', pokeId:571, name:'ゾロアーク', secret:true,
    unlockCondition: 'world5', hint:'知識を蓄え続けると…' },
]

export function checkSecretUnlocks({ diaryCount, gachaCount, eqDays, perfect, weeklyCount, worldCount }) {
  const unlocked = []
  const stored   = (() => { try { return JSON.parse(localStorage.getItem('secretUnlocked')) || [] } catch { return [] } })()
  const alreadyUnlocked = new Set(stored)

  const check = (id, condition) => {
    if (!alreadyUnlocked.has(id) && condition) {
      unlocked.push(SECRET_REWARDS.find(r => r.id === id))
      alreadyUnlocked.add(id)
    }
  }

  check('secret_diary10',  diaryCount  >= 10)
  check('secret_gacha30',  gachaCount  >= 30)
  check('secret_eq7',      eqDays      >= 7)
  check('secret_perfect15',perfect     >= 15)
  check('secret_weekly3',  weeklyCount >= 3)
  check('secret_world5',   worldCount  >= 5)

  if (unlocked.length) {
    localStorage.setItem('secretUnlocked', JSON.stringify([...alreadyUnlocked]))
  }
  return unlocked.filter(Boolean)
}

export function getSecretUnlocked() {
  try { return JSON.parse(localStorage.getItem('secretUnlocked')) || [] } catch { return [] }
}

/* ─── 完璧な日の達成報酬（50日分）─── */
export const PERFECT_DAY_REWARDS = [
  { id:'pd_1',  type:'stamp',   emoji:'⭐', stampBg:'linear-gradient(135deg,#FFD700,#FFA500)', name:'はじめての完璧', label:'はじめての完璧', perfectCount:1  },
  { id:'pd_2',  type:'title',   label:'真剣モード', color:'#6C63FF', name:'真剣モード', perfectCount:2  },
  { id:'pd_3',  type:'acc',     emoji:'🌟', pos:ACC_POS.tr, name:'ゴールドスター', label:'ゴールドスター', perfectCount:3  },
  { id:'pd_4',  type:'stamp',   emoji:'🎯', stampBg:'linear-gradient(135deg,#EF4444,#B91C1C)', name:'的中の証', label:'的中の証', perfectCount:4  },
  { id:'pd_5',  type:'frame',   style:{border:'2px solid #FFD700', boxShadow:'0 0 14px rgba(255,215,0,0.5)'}, name:'パーフェクトフレームI', label:'パーフェクトフレームI', perfectCount:5  },
  { id:'pd_6',  type:'title',   label:'向上する者', color:'#00C851', name:'向上する者', perfectCount:6  },
  { id:'pd_7',  type:'bg',      bg:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', name:'パープルグラデ', label:'パープルグラデ', perfectCount:7  },
  { id:'pd_8',  type:'acc',     emoji:'💎', pos:ACC_POS.tl, name:'ダイヤモンド', label:'ダイヤモンド', perfectCount:8  },
  { id:'pd_9',  type:'stamp',   emoji:'💪', stampBg:'linear-gradient(135deg,#2F4858,#4A7B96)', name:'努力の証', label:'努力の証', perfectCount:9  },
  { id:'pd_10', type:'pokemon', pokeId:175, name:'トゲピー',  perfectCount:10 },
  { id:'pd_11', type:'title',   label:'10日の戦士', color:'#F2994A', name:'10日の戦士', perfectCount:11 },
  { id:'pd_12', type:'effect',  cssClass:'effect-gold-glow', name:'ゴールドオーラ', label:'ゴールドオーラ', perfectCount:12 },
  { id:'pd_13', type:'frame',   cssClass:'frame-aurora', name:'オーロラフレーム', label:'オーロラフレーム', perfectCount:13 },
  { id:'pd_14', type:'bg',      bg:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', name:'ギャラクシー夜', label:'ギャラクシー夜', perfectCount:14 },
  { id:'pd_15', type:'pokemon', pokeId:385, name:'ジラーチ',  perfectCount:15 },
  { id:'pd_16', type:'title',   label:'自分に勝った人', color:'#E85D2A', name:'自分に勝った人', perfectCount:16 },
  { id:'pd_17', type:'stamp',   emoji:'🔥', stampBg:'linear-gradient(135deg,#FF6B35,#F2994A)', name:'炎の証', label:'炎の証', perfectCount:17 },
  { id:'pd_18', type:'acc',     emoji:'👑', pos:ACC_POS.tc, name:'完璧王冠', label:'完璧王冠', perfectCount:18 },
  { id:'pd_19', type:'effect',  cssClass:'effect-silver', name:'シルバーオーラ', label:'シルバーオーラ', perfectCount:19 },
  { id:'pd_20', type:'pokemon', pokeId:151, name:'ミュウ',    perfectCount:20 },
  { id:'pd_21', type:'title',   label:'覚醒者', color:'#9B59B6', name:'覚醒者', perfectCount:21 },
  { id:'pd_22', type:'bg',      bg:'linear-gradient(135deg,#FF416C,#FF4B2B)', name:'レッドフレイム', label:'レッドフレイム', perfectCount:22 },
  { id:'pd_23', type:'frame',   cssClass:'frame-rainbow', name:'レインボーフレーム（完璧）', label:'レインボーフレーム（完璧）', perfectCount:23 },
  { id:'pd_24', type:'stamp',   emoji:'🦋', stampBg:'linear-gradient(135deg,#667eea,#764ba2)', name:'変容の証', label:'変容の証', perfectCount:24 },
  { id:'pd_25', type:'pokemon', pokeId:494, name:'ビクティニ', perfectCount:25 },
  { id:'pd_26', type:'title',   label:'25日の奇跡', color:'#FFD700', name:'25日の奇跡', perfectCount:26 },
  { id:'pd_27', type:'effect',  cssClass:'effect-rainbow', name:'レインボーオーラ（完璧）', label:'レインボーオーラ（完璧）', perfectCount:27 },
  { id:'pd_28', type:'acc',     emoji:'⚡', pos:ACC_POS.tr, name:'稲妻アクセ', label:'稲妻アクセ', perfectCount:28 },
  { id:'pd_29', type:'bg',      bg:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', name:'ディープネイビー', label:'ディープネイビー', perfectCount:29 },
  { id:'pd_30', type:'pokemon', pokeId:150, name:'ミュウツー', perfectCount:30 },
  { id:'pd_31', type:'title',   label:'習慣の達人（完璧）', color:'#00C851', name:'習慣の達人（完璧）', perfectCount:31 },
  { id:'pd_32', type:'frame',   cssClass:'frame-legendary', name:'レジェンダリーフレーム（完璧）', label:'レジェンダリーフレーム（完璧）', perfectCount:32 },
  { id:'pd_33', type:'stamp',   emoji:'🏆', stampBg:'linear-gradient(135deg,#FFD700,#FF8C00)', name:'トロフィー', label:'トロフィー', perfectCount:33 },
  { id:'pd_34', type:'effect',  cssClass:'effect-legendary', name:'伝説のオーラ（完璧）', label:'伝説のオーラ（完璧）', perfectCount:34 },
  { id:'pd_35', type:'pokemon', pokeId:249, name:'ルギア',    perfectCount:35 },
  { id:'pd_36', type:'title',   label:'真の継続者', color:'#E85D2A', name:'真の継続者', perfectCount:36 },
  { id:'pd_37', type:'bg',      bg:'radial-gradient(ellipse at center, #1a0533 0%, #6C63FF 50%, #1a0533 100%)', name:'神秘の宇宙', label:'神秘の宇宙', perfectCount:37 },
  { id:'pd_38', type:'acc',     emoji:'👁️', pos:ACC_POS.tl, name:'神の眼', label:'神の眼', perfectCount:38 },
  { id:'pd_39', type:'frame',   cssClass:'frame-godlike', name:'神級フレーム（完璧）', label:'神級フレーム（完璧）', perfectCount:39 },
  { id:'pd_40', type:'pokemon', pokeId:250, name:'ホウオウ',  perfectCount:40 },
  { id:'pd_41', type:'title',   label:'不動心', color:'#9B59B6', name:'不動心', perfectCount:41 },
  { id:'pd_42', type:'effect',  cssClass:'effect-sparkle', name:'スパークルオーラ（完璧）', label:'スパークルオーラ（完璧）', perfectCount:42 },
  { id:'pd_43', type:'stamp',   emoji:'🌌', stampBg:'linear-gradient(135deg,#0f0c29,#302b63)', name:'宇宙の証', label:'宇宙の証', perfectCount:43 },
  { id:'pd_44', type:'bg',      bg:'linear-gradient(135deg,#000000 0%,#1a0533 50%,#000000 100%)', name:'黒耀', label:'黒耀', perfectCount:44 },
  { id:'pd_45', type:'pokemon', pokeId:384, name:'レックウザ', perfectCount:45 },
  { id:'pd_46', type:'title',   label:'究極の在り方', color:'#FFD700', name:'究極の在り方', perfectCount:46 },
  { id:'pd_47', type:'frame',   style:{border:'3px solid #FFD700', boxShadow:'0 0 24px rgba(255,215,0,0.9), 0 0 48px rgba(255,140,0,0.4)'}, name:'神聖なる輝き', label:'神聖なる輝き', perfectCount:47 },
  { id:'pd_48', type:'acc',     emoji:'🌠', pos:ACC_POS.tr, name:'流れ星', label:'流れ星', perfectCount:48 },
  { id:'pd_49', type:'effect',  cssClass:'effect-fire-aura', name:'炎神のオーラ（完璧）', label:'炎神のオーラ（完璧）', perfectCount:49 },
  { id:'pd_50', type:'pokemon', pokeId:483, name:'ディアルガ', perfectCount:50 },
]

/* ─── プレミアムガチャプール ─── */
export const PREMIUM_GACHA_POOL = [
  // common (モンスターボール)
  { id:'pg_st01', type:'stamp',  emoji:'🎪', stampBg:'linear-gradient(135deg,#FF6B35,#F2994A)', name:'プレミアムサーカス', label:'プレミアムサーカス', rarity:'common', premiumGacha:true },
  { id:'pg_st02', type:'stamp',  emoji:'🌊', stampBg:'linear-gradient(135deg,#0288D1,#039BE5)', name:'プレミアム波', label:'プレミアム波', rarity:'common', premiumGacha:true },
  { id:'pg_st03', type:'stamp',  emoji:'🎭', stampBg:'linear-gradient(135deg,#9C27B0,#673AB7)', name:'プレミアム演', label:'プレミアム演', rarity:'common', premiumGacha:true },
  { id:'pg_t01',  type:'title',  label:'ガチャ好き', color:'#FF9800', name:'ガチャ好き', rarity:'common', premiumGacha:true },
  { id:'pg_t02',  type:'title',  label:'継続中', color:'#4CAF50', name:'継続中', rarity:'common', premiumGacha:true },
  { id:'pg_ac01', type:'acc',    emoji:'🎀', pos:ACC_POS.tr, name:'リボン（プレミアム）', label:'リボン（プレミアム）', rarity:'common', premiumGacha:true },
  // uncommon (スーパーボール)
  { id:'pg_bg01', type:'bg',     bg:'linear-gradient(135deg,#1CB5E0,#000851)', name:'プレミアムネイビー', label:'プレミアムネイビー', rarity:'uncommon', premiumGacha:true },
  { id:'pg_bg02', type:'bg',     bg:'linear-gradient(135deg,#fc4a1a,#f7b733)', name:'プレミアムサンセット', label:'プレミアムサンセット', rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr01', type:'frame',  style:{border:'2px solid #00E5FF',boxShadow:'0 0 16px rgba(0,229,255,0.5)'}, name:'プレミアムシアン', label:'プレミアムシアン', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t03',  type:'title',  label:'粘り強い', color:'#2196F3', name:'粘り強い', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t04',  type:'title',  label:'探求者', color:'#9C27B0', name:'探求者', rarity:'uncommon', premiumGacha:true },
  // rare (ハイパーボール) + Pokémon
  { id:'pg_ef01', type:'effect', cssClass:'effect-pulse',    name:'パルスオーラ', label:'パルスオーラ', rarity:'rare', premiumGacha:true },
  { id:'pg_ef02', type:'effect', cssClass:'effect-ice-aura', name:'アイスオーラ', label:'アイスオーラ', rarity:'rare', premiumGacha:true },
  { id:'pg_fr02', type:'frame',  cssClass:'frame-fire',      name:'炎フレーム（プレミアム）', label:'炎フレーム（プレミアム）', rarity:'rare', premiumGacha:true },
  { id:'pg_t05',  type:'title',  label:'挑戦者', color:'#E85D2A', name:'挑戦者', rarity:'rare', premiumGacha:true },
  // ultra (マスターボール) 非ポケモン
  { id:'pg_ef03', type:'effect', cssClass:'effect-lightning', name:'ライトニングオーラ（プレミアム）', label:'ライトニングオーラ（プレミアム）', rarity:'ultra', premiumGacha:true },
  { id:'pg_fr03', type:'frame',  cssClass:'frame-diamond',    name:'ダイヤモンドフレーム', label:'ダイヤモンドフレーム', rarity:'ultra', premiumGacha:true },
  { id:'pg_t06',  type:'title',  label:'プレミアムマスター', color:'#FFD700', name:'プレミアムマスター', rarity:'ultra', premiumGacha:true },

  // ══════════════════════════════════════════════
  //  ポケモン全地方 300種以上
  //  common  = 種ポケモン・赤ちゃんポケモン（ノーマルボール）
  //  uncommon= 比較的マイナーなポケモン（スーパーボール）
  //  rare    = 最終進化ポケモン（ハイパーボール）
  //  ultra   = 伝説・幻・色違いポケモン（マスターボール）
  // ══════════════════════════════════════════════

  // ── common (種ポケモン・赤ちゃんポケモン) ──
  // Gen 1
  { id:'pg_c01', type:'pokemon', pokeId:1,   name:'フシギダネ',  rarity:'common', premiumGacha:true },
  { id:'pg_c02', type:'pokemon', pokeId:4,   name:'ヒトカゲ',    rarity:'common', premiumGacha:true },
  { id:'pg_c03', type:'pokemon', pokeId:7,   name:'ゼニガメ',    rarity:'common', premiumGacha:true },
  { id:'pg_c04', type:'pokemon', pokeId:10,  name:'キャタピー',  rarity:'common', premiumGacha:true },
  { id:'pg_c05', type:'pokemon', pokeId:16,  name:'ポッポ',      rarity:'common', premiumGacha:true },
  { id:'pg_c06', type:'pokemon', pokeId:23,  name:'アーボ',      rarity:'common', premiumGacha:true },
  { id:'pg_c07', type:'pokemon', pokeId:27,  name:'サンド',      rarity:'common', premiumGacha:true },
  { id:'pg_c08', type:'pokemon', pokeId:29,  name:'ニドラン♀',  rarity:'common', premiumGacha:true },
  { id:'pg_c09', type:'pokemon', pokeId:32,  name:'ニドラン♂',  rarity:'common', premiumGacha:true },
  { id:'pg_c10', type:'pokemon', pokeId:35,  name:'ピッピ',      rarity:'common', premiumGacha:true },
  { id:'pg_c11', type:'pokemon', pokeId:37,  name:'ロコン',      rarity:'common', premiumGacha:true },
  { id:'pg_c12', type:'pokemon', pokeId:39,  name:'プリン',      rarity:'common', premiumGacha:true },
  { id:'pg_c13', type:'pokemon', pokeId:41,  name:'ズバット',    rarity:'common', premiumGacha:true },
  { id:'pg_c14', type:'pokemon', pokeId:43,  name:'ナゾノクサ',  rarity:'common', premiumGacha:true },
  { id:'pg_c15', type:'pokemon', pokeId:46,  name:'パラス',      rarity:'common', premiumGacha:true },
  { id:'pg_c16', type:'pokemon', pokeId:50,  name:'ディグダ',    rarity:'common', premiumGacha:true },
  { id:'pg_c17', type:'pokemon', pokeId:52,  name:'ニャース',    rarity:'common', premiumGacha:true },
  { id:'pg_c18', type:'pokemon', pokeId:54,  name:'コダック',    rarity:'common', premiumGacha:true },
  { id:'pg_c19', type:'pokemon', pokeId:56,  name:'マンキー',    rarity:'common', premiumGacha:true },
  { id:'pg_c20', type:'pokemon', pokeId:58,  name:'ガーディ',    rarity:'common', premiumGacha:true },
  { id:'pg_c21', type:'pokemon', pokeId:63,  name:'ケーシィ',    rarity:'common', premiumGacha:true },
  { id:'pg_c22', type:'pokemon', pokeId:66,  name:'ワンリキー',  rarity:'common', premiumGacha:true },
  { id:'pg_c23', type:'pokemon', pokeId:74,  name:'イシツブテ',  rarity:'common', premiumGacha:true },
  { id:'pg_c24', type:'pokemon', pokeId:77,  name:'ポニータ',    rarity:'common', premiumGacha:true },
  { id:'pg_c25', type:'pokemon', pokeId:79,  name:'ヤドン',      rarity:'common', premiumGacha:true },
  { id:'pg_c26', type:'pokemon', pokeId:92,  name:'ゴース',      rarity:'common', premiumGacha:true },
  { id:'pg_c27', type:'pokemon', pokeId:109, name:'ドガース',    rarity:'common', premiumGacha:true },
  { id:'pg_c28', type:'pokemon', pokeId:116, name:'タッツー',    rarity:'common', premiumGacha:true },
  { id:'pg_c29', type:'pokemon', pokeId:129, name:'コイキング',  rarity:'common', premiumGacha:true },
  { id:'pg_c30', type:'pokemon', pokeId:133, name:'イーブイ',    rarity:'common', premiumGacha:true },
  // 赤ちゃんポケモン
  { id:'pg_c31', type:'pokemon', pokeId:172, name:'ピチュー',    rarity:'common', premiumGacha:true },
  { id:'pg_c32', type:'pokemon', pokeId:173, name:'ピィ',        rarity:'common', premiumGacha:true },
  { id:'pg_c33', type:'pokemon', pokeId:174, name:'ププリン',    rarity:'common', premiumGacha:true },
  { id:'pg_c34', type:'pokemon', pokeId:175, name:'トゲピー',    rarity:'common', premiumGacha:true },
  { id:'pg_c35', type:'pokemon', pokeId:236, name:'バルキー',    rarity:'common', premiumGacha:true },
  { id:'pg_c36', type:'pokemon', pokeId:238, name:'ムチュール',  rarity:'common', premiumGacha:true },
  { id:'pg_c37', type:'pokemon', pokeId:239, name:'エレキッド',  rarity:'common', premiumGacha:true },
  { id:'pg_c38', type:'pokemon', pokeId:240, name:'ブビィ',      rarity:'common', premiumGacha:true },
  { id:'pg_c39', type:'pokemon', pokeId:298, name:'ルリリ',      rarity:'common', premiumGacha:true },
  { id:'pg_c40', type:'pokemon', pokeId:360, name:'ソーナノ',    rarity:'common', premiumGacha:true },
  { id:'pg_c41', type:'pokemon', pokeId:406, name:'スボミー',    rarity:'common', premiumGacha:true },
  { id:'pg_c42', type:'pokemon', pokeId:439, name:'マネネ',      rarity:'common', premiumGacha:true },
  { id:'pg_c43', type:'pokemon', pokeId:440, name:'ピンプク',    rarity:'common', premiumGacha:true },
  { id:'pg_c44', type:'pokemon', pokeId:446, name:'ゴンベ',      rarity:'common', premiumGacha:true },
  { id:'pg_c45', type:'pokemon', pokeId:848, name:'ヤバチャ',    rarity:'common', premiumGacha:true },
  // Gen 2
  { id:'pg_c46', type:'pokemon', pokeId:152, name:'チコリータ',  rarity:'common', premiumGacha:true },
  { id:'pg_c47', type:'pokemon', pokeId:155, name:'ヒノアラシ',  rarity:'common', premiumGacha:true },
  { id:'pg_c48', type:'pokemon', pokeId:158, name:'ワニノコ',    rarity:'common', premiumGacha:true },
  { id:'pg_c49', type:'pokemon', pokeId:183, name:'マリル',      rarity:'common', premiumGacha:true },
  { id:'pg_c50', type:'pokemon', pokeId:209, name:'ブルー',      rarity:'common', premiumGacha:true },
  { id:'pg_c51', type:'pokemon', pokeId:216, name:'ヒメグマ',    rarity:'common', premiumGacha:true },
  { id:'pg_c52', type:'pokemon', pokeId:228, name:'コアルヒー',  rarity:'common', premiumGacha:true },
  { id:'pg_c53', type:'pokemon', pokeId:231, name:'ゴマゾウ',    rarity:'common', premiumGacha:true },
  // Gen 3
  { id:'pg_c54', type:'pokemon', pokeId:252, name:'キモリ',      rarity:'common', premiumGacha:true },
  { id:'pg_c55', type:'pokemon', pokeId:255, name:'アチャモ',    rarity:'common', premiumGacha:true },
  { id:'pg_c56', type:'pokemon', pokeId:258, name:'ミズゴロウ',  rarity:'common', premiumGacha:true },
  { id:'pg_c57', type:'pokemon', pokeId:280, name:'ラルトス',    rarity:'common', premiumGacha:true },
  { id:'pg_c58', type:'pokemon', pokeId:304, name:'ゴニョニョ',  rarity:'common', premiumGacha:true },
  { id:'pg_c59', type:'pokemon', pokeId:371, name:'タツベイ',    rarity:'common', premiumGacha:true },
  { id:'pg_c60', type:'pokemon', pokeId:374, name:'ダンバル',    rarity:'common', premiumGacha:true },
  // Gen 4
  { id:'pg_c61', type:'pokemon', pokeId:387, name:'ナエトル',    rarity:'common', premiumGacha:true },
  { id:'pg_c62', type:'pokemon', pokeId:390, name:'ヒコザル',    rarity:'common', premiumGacha:true },
  { id:'pg_c63', type:'pokemon', pokeId:393, name:'ポッチャマ',  rarity:'common', premiumGacha:true },
  { id:'pg_c64', type:'pokemon', pokeId:403, name:'コリンク',    rarity:'common', premiumGacha:true },
  { id:'pg_c65', type:'pokemon', pokeId:418, name:'ブイゼル',    rarity:'common', premiumGacha:true },
  { id:'pg_c66', type:'pokemon', pokeId:427, name:'ミミロル',    rarity:'common', premiumGacha:true },
  { id:'pg_c67', type:'pokemon', pokeId:443, name:'フカマル',    rarity:'common', premiumGacha:true },
  // Gen 5
  { id:'pg_c68', type:'pokemon', pokeId:495, name:'ツタージャ',  rarity:'common', premiumGacha:true },
  { id:'pg_c69', type:'pokemon', pokeId:498, name:'ポカブ',      rarity:'common', premiumGacha:true },
  { id:'pg_c70', type:'pokemon', pokeId:501, name:'ミジュマル',  rarity:'common', premiumGacha:true },
  { id:'pg_c71', type:'pokemon', pokeId:572, name:'チラーミィ',  rarity:'common', premiumGacha:true },
  { id:'pg_c72', type:'pokemon', pokeId:587, name:'エモンガ',    rarity:'common', premiumGacha:true },
  { id:'pg_c73', type:'pokemon', pokeId:610, name:'キバゴ',      rarity:'common', premiumGacha:true },
  { id:'pg_c74', type:'pokemon', pokeId:633, name:'モノズ',      rarity:'common', premiumGacha:true },
  // Gen 6
  { id:'pg_c75', type:'pokemon', pokeId:650, name:'ハリマロン',  rarity:'common', premiumGacha:true },
  { id:'pg_c76', type:'pokemon', pokeId:653, name:'フォッコ',    rarity:'common', premiumGacha:true },
  { id:'pg_c77', type:'pokemon', pokeId:656, name:'ケロマツ',    rarity:'common', premiumGacha:true },
  { id:'pg_c78', type:'pokemon', pokeId:661, name:'ヤヤコマ',    rarity:'common', premiumGacha:true },
  { id:'pg_c79', type:'pokemon', pokeId:704, name:'ヌメラ',      rarity:'common', premiumGacha:true },
  // Gen 7
  { id:'pg_c80', type:'pokemon', pokeId:722, name:'モクロー',    rarity:'common', premiumGacha:true },
  { id:'pg_c81', type:'pokemon', pokeId:725, name:'ニャビー',    rarity:'common', premiumGacha:true },
  { id:'pg_c82', type:'pokemon', pokeId:728, name:'アシマリ',    rarity:'common', premiumGacha:true },
  { id:'pg_c83', type:'pokemon', pokeId:744, name:'イワンコ',    rarity:'common', premiumGacha:true },
  { id:'pg_c84', type:'pokemon', pokeId:782, name:'ジャラコ',    rarity:'common', premiumGacha:true },
  // Gen 8
  { id:'pg_c85', type:'pokemon', pokeId:810, name:'サルノリ',    rarity:'common', premiumGacha:true },
  { id:'pg_c86', type:'pokemon', pokeId:813, name:'ヒバニー',    rarity:'common', premiumGacha:true },
  { id:'pg_c87', type:'pokemon', pokeId:816, name:'メッソン',    rarity:'common', premiumGacha:true },
  { id:'pg_c88', type:'pokemon', pokeId:831, name:'ウールー',    rarity:'common', premiumGacha:true },
  { id:'pg_c89', type:'pokemon', pokeId:885, name:'ドラメシヤ',  rarity:'common', premiumGacha:true },
  // Gen 9
  { id:'pg_c90', type:'pokemon', pokeId:906, name:'ニャオハ',    rarity:'common', premiumGacha:true },
  { id:'pg_c91', type:'pokemon', pokeId:909, name:'ホゲータ',    rarity:'common', premiumGacha:true },
  { id:'pg_c92', type:'pokemon', pokeId:912, name:'クワッス',    rarity:'common', premiumGacha:true },
  { id:'pg_c93', type:'pokemon', pokeId:921, name:'パモ',        rarity:'common', premiumGacha:true },
  { id:'pg_c94', type:'pokemon', pokeId:840, name:'パジャマン',  rarity:'common', premiumGacha:true },

  // ── uncommon (比較的マイナーなポケモン) ──
  // Gen 1
  { id:'pg_u01', type:'pokemon', pokeId:20,  name:'ラッタ',      rarity:'uncommon', premiumGacha:true },
  { id:'pg_u02', type:'pokemon', pokeId:22,  name:'オニドリル',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u03', type:'pokemon', pokeId:24,  name:'アーボック',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u04', type:'pokemon', pokeId:47,  name:'パラセクト',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u05', type:'pokemon', pokeId:49,  name:'モルフォン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u06', type:'pokemon', pokeId:51,  name:'ダグトリオ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u07', type:'pokemon', pokeId:53,  name:'ペルシアン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u08', type:'pokemon', pokeId:57,  name:'オコリザル',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u09', type:'pokemon', pokeId:62,  name:'ニョロボン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u10', type:'pokemon', pokeId:71,  name:'ウツボット',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u11', type:'pokemon', pokeId:73,  name:'ドククラゲ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u12', type:'pokemon', pokeId:83,  name:'カモネギ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u13', type:'pokemon', pokeId:85,  name:'ドードリオ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u14', type:'pokemon', pokeId:87,  name:'ジュゴン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u15', type:'pokemon', pokeId:89,  name:'ベトベトン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u16', type:'pokemon', pokeId:97,  name:'スリーパー',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u17', type:'pokemon', pokeId:99,  name:'キングラー',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u18', type:'pokemon', pokeId:101, name:'マルマイン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u19', type:'pokemon', pokeId:103, name:'ナッシー',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u20', type:'pokemon', pokeId:108, name:'ベロリンガ',  rarity:'uncommon', premiumGacha:true },
  // Gen 2
  { id:'pg_u21', type:'pokemon', pokeId:162, name:'オオタチ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u22', type:'pokemon', pokeId:164, name:'ヨルノズク',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u23', type:'pokemon', pokeId:166, name:'レディアン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u24', type:'pokemon', pokeId:168, name:'アリアドス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u25', type:'pokemon', pokeId:171, name:'ランターン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u26', type:'pokemon', pokeId:178, name:'ネイティオ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u27', type:'pokemon', pokeId:182, name:'キレイハナ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u28', type:'pokemon', pokeId:184, name:'マリルリ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u29', type:'pokemon', pokeId:185, name:'ウソッキー',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u30', type:'pokemon', pokeId:200, name:'ムウマ',      rarity:'uncommon', premiumGacha:true },
  { id:'pg_u31', type:'pokemon', pokeId:202, name:'ソーナンス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u32', type:'pokemon', pokeId:203, name:'キリンリキ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u33', type:'pokemon', pokeId:211, name:'ハリーセン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u34', type:'pokemon', pokeId:213, name:'ツボツボ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u35', type:'pokemon', pokeId:225, name:'デリバード',  rarity:'uncommon', premiumGacha:true },
  // Gen 3
  { id:'pg_u36', type:'pokemon', pokeId:284, name:'マスキッパ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u37', type:'pokemon', pokeId:311, name:'プラスル',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u38', type:'pokemon', pokeId:312, name:'マイナン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u39', type:'pokemon', pokeId:315, name:'バラボン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u40', type:'pokemon', pokeId:317, name:'マルノーム',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u41', type:'pokemon', pokeId:332, name:'ノクタス',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u42', type:'pokemon', pokeId:351, name:'ポワルン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u43', type:'pokemon', pokeId:352, name:'カクレオン',  rarity:'uncommon', premiumGacha:true },
  // Gen 4
  { id:'pg_u44', type:'pokemon', pokeId:414, name:'ミノマダム',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u45', type:'pokemon', pokeId:416, name:'ビークイン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u46', type:'pokemon', pokeId:417, name:'パチリス',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u47', type:'pokemon', pokeId:419, name:'フローゼル',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u48', type:'pokemon', pokeId:424, name:'エテボース',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u49', type:'pokemon', pokeId:432, name:'ブニャット',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u50', type:'pokemon', pokeId:441, name:'ペラップ',    rarity:'uncommon', premiumGacha:true },
  // Gen 5
  { id:'pg_u51', type:'pokemon', pokeId:505, name:'ミルホッグ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u52', type:'pokemon', pokeId:510, name:'レパルダス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u53', type:'pokemon', pokeId:521, name:'ケンホロウ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u54', type:'pokemon', pokeId:537, name:'ガマゲロゲ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u55', type:'pokemon', pokeId:542, name:'ハハコモリ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u56', type:'pokemon', pokeId:545, name:'ペンドラー',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u57', type:'pokemon', pokeId:579, name:'ランクルス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u58', type:'pokemon', pokeId:618, name:'マッギョ',    rarity:'uncommon', premiumGacha:true },
  // Gen 6
  { id:'pg_u59', type:'pokemon', pokeId:668, name:'カエンジシ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u60', type:'pokemon', pokeId:671, name:'フラージェス',rarity:'uncommon', premiumGacha:true },
  { id:'pg_u61', type:'pokemon', pokeId:673, name:'ゴーゴート',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u62', type:'pokemon', pokeId:685, name:'シュシュプ',  rarity:'uncommon', premiumGacha:true },
  // Gen 7
  { id:'pg_u63', type:'pokemon', pokeId:733, name:'ドデカバシ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u64', type:'pokemon', pokeId:754, name:'ラランテス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u65', type:'pokemon', pokeId:756, name:'マシェード',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u66', type:'pokemon', pokeId:764, name:'キュワワー',  rarity:'uncommon', premiumGacha:true },
  // Gen 8
  { id:'pg_u67', type:'pokemon', pokeId:869, name:'マホイップ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u68', type:'pokemon', pokeId:873, name:'モスノウ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u69', type:'pokemon', pokeId:875, name:'コオリッポ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u70', type:'pokemon', pokeId:876, name:'イエッサン',  rarity:'uncommon', premiumGacha:true },
  // Gen 9
  { id:'pg_u71', type:'pokemon', pokeId:930, name:'アルボラン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u72', type:'pokemon', pokeId:946, name:'グラエナ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u73', type:'pokemon', pokeId:948, name:'ブランバス',  rarity:'uncommon', premiumGacha:true },

  // ── rare (最終進化ポケモン) ──
  // Gen 1
  { id:'pg_r01', type:'pokemon', pokeId:3,   name:'フシギバナ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r02', type:'pokemon', pokeId:6,   name:'リザードン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r03', type:'pokemon', pokeId:9,   name:'カメックス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r04', type:'pokemon', pokeId:34,  name:'ニドキング',  rarity:'rare', premiumGacha:true },
  { id:'pg_r05', type:'pokemon', pokeId:38,  name:'キュウコン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r06', type:'pokemon', pokeId:40,  name:'プクリン',    rarity:'rare', premiumGacha:true },
  { id:'pg_r07', type:'pokemon', pokeId:59,  name:'ウインディ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r08', type:'pokemon', pokeId:65,  name:'フーディン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r09', type:'pokemon', pokeId:68,  name:'カイリキー',  rarity:'rare', premiumGacha:true },
  { id:'pg_r10', type:'pokemon', pokeId:76,  name:'ゴローニャ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r11', type:'pokemon', pokeId:78,  name:'ギャロップ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r12', type:'pokemon', pokeId:94,  name:'ゲンガー',    rarity:'rare', premiumGacha:true },
  { id:'pg_r13', type:'pokemon', pokeId:113, name:'ラッキー',    rarity:'rare', premiumGacha:true },
  { id:'pg_r14', type:'pokemon', pokeId:121, name:'スターミー',  rarity:'rare', premiumGacha:true },
  { id:'pg_r15', type:'pokemon', pokeId:130, name:'ギャラドス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r16', type:'pokemon', pokeId:131, name:'ラプラス',    rarity:'rare', premiumGacha:true },
  { id:'pg_r17', type:'pokemon', pokeId:143, name:'カビゴン',    rarity:'rare', premiumGacha:true },
  { id:'pg_r18', type:'pokemon', pokeId:149, name:'カイリュー',  rarity:'rare', premiumGacha:true },
  // Gen 2
  { id:'pg_r19', type:'pokemon', pokeId:154, name:'メガニウム',  rarity:'rare', premiumGacha:true },
  { id:'pg_r20', type:'pokemon', pokeId:157, name:'バクフーン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r21', type:'pokemon', pokeId:160, name:'オーダイル',  rarity:'rare', premiumGacha:true },
  { id:'pg_r22', type:'pokemon', pokeId:181, name:'デンリュウ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r23', type:'pokemon', pokeId:196, name:'エーフィ',    rarity:'rare', premiumGacha:true },
  { id:'pg_r24', type:'pokemon', pokeId:197, name:'ブラッキー',  rarity:'rare', premiumGacha:true },
  { id:'pg_r25', type:'pokemon', pokeId:208, name:'ハガネール',  rarity:'rare', premiumGacha:true },
  { id:'pg_r26', type:'pokemon', pokeId:212, name:'ハッサム',    rarity:'rare', premiumGacha:true },
  { id:'pg_r27', type:'pokemon', pokeId:229, name:'ヘルガー',    rarity:'rare', premiumGacha:true },
  { id:'pg_r28', type:'pokemon', pokeId:242, name:'ハピナス',    rarity:'rare', premiumGacha:true },
  { id:'pg_r29', type:'pokemon', pokeId:248, name:'バンギラス',  rarity:'rare', premiumGacha:true },
  // Gen 3
  { id:'pg_r30', type:'pokemon', pokeId:254, name:'ジュカイン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r31', type:'pokemon', pokeId:257, name:'バシャーモ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r32', type:'pokemon', pokeId:260, name:'ラグラージ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r33', type:'pokemon', pokeId:282, name:'サーナイト',  rarity:'rare', premiumGacha:true },
  { id:'pg_r34', type:'pokemon', pokeId:306, name:'ボスゴドラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r35', type:'pokemon', pokeId:330, name:'フライゴン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r36', type:'pokemon', pokeId:350, name:'ミロカロス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r37', type:'pokemon', pokeId:359, name:'アブソル',    rarity:'rare', premiumGacha:true },
  { id:'pg_r38', type:'pokemon', pokeId:373, name:'ボーマンダ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r39', type:'pokemon', pokeId:376, name:'メタグロス',  rarity:'rare', premiumGacha:true },
  // Gen 4
  { id:'pg_r40', type:'pokemon', pokeId:389, name:'ドダイトス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r41', type:'pokemon', pokeId:392, name:'ゴウカザル',  rarity:'rare', premiumGacha:true },
  { id:'pg_r42', type:'pokemon', pokeId:395, name:'エンペルト',  rarity:'rare', premiumGacha:true },
  { id:'pg_r43', type:'pokemon', pokeId:445, name:'ガブリアス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r44', type:'pokemon', pokeId:448, name:'ルカリオ',    rarity:'rare', premiumGacha:true },
  { id:'pg_r45', type:'pokemon', pokeId:461, name:'マニューラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r46', type:'pokemon', pokeId:468, name:'トゲキッス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r47', type:'pokemon', pokeId:470, name:'リーフィア',  rarity:'rare', premiumGacha:true },
  { id:'pg_r48', type:'pokemon', pokeId:471, name:'グレイシア',  rarity:'rare', premiumGacha:true },
  { id:'pg_r49', type:'pokemon', pokeId:475, name:'エルレイド',  rarity:'rare', premiumGacha:true },
  // Gen 5
  { id:'pg_r50', type:'pokemon', pokeId:497, name:'ジャローダ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r51', type:'pokemon', pokeId:500, name:'エンブオー',  rarity:'rare', premiumGacha:true },
  { id:'pg_r52', type:'pokemon', pokeId:503, name:'ダイケンキ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r53', type:'pokemon', pokeId:553, name:'ワルビアル',  rarity:'rare', premiumGacha:true },
  { id:'pg_r54', type:'pokemon', pokeId:609, name:'シャンデラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r55', type:'pokemon', pokeId:612, name:'オノノクス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r56', type:'pokemon', pokeId:625, name:'キリキザン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r57', type:'pokemon', pokeId:635, name:'サザンドラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r58', type:'pokemon', pokeId:637, name:'ウルガモス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r59', type:'pokemon', pokeId:700, name:'ニンフィア',  rarity:'rare', premiumGacha:true },
  // Gen 6
  { id:'pg_r60', type:'pokemon', pokeId:652, name:'ブリガロン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r61', type:'pokemon', pokeId:655, name:'マフォクシー', rarity:'rare', premiumGacha:true },
  { id:'pg_r62', type:'pokemon', pokeId:658, name:'ゲッコウガ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r63', type:'pokemon', pokeId:681, name:'ギルガルド',  rarity:'rare', premiumGacha:true },
  { id:'pg_r64', type:'pokemon', pokeId:706, name:'ヌメルゴン',  rarity:'rare', premiumGacha:true },
  // Gen 7
  { id:'pg_r65', type:'pokemon', pokeId:724, name:'ジュナイパー', rarity:'rare', premiumGacha:true },
  { id:'pg_r66', type:'pokemon', pokeId:727, name:'ガオガエン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r67', type:'pokemon', pokeId:730, name:'アシレーヌ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r68', type:'pokemon', pokeId:745, name:'ルガルガン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r69', type:'pokemon', pokeId:748, name:'ドヒドイデ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r70', type:'pokemon', pokeId:778, name:'ミミッキュ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r71', type:'pokemon', pokeId:784, name:'カプ・コケコ',rarity:'rare', premiumGacha:true },
  // Gen 8
  { id:'pg_r72', type:'pokemon', pokeId:812, name:'ゴリランダー', rarity:'rare', premiumGacha:true },
  { id:'pg_r73', type:'pokemon', pokeId:815, name:'エースバーン', rarity:'rare', premiumGacha:true },
  { id:'pg_r74', type:'pokemon', pokeId:818, name:'インテレオン', rarity:'rare', premiumGacha:true },
  { id:'pg_r75', type:'pokemon', pokeId:823, name:'アーマーガア', rarity:'rare', premiumGacha:true },
  { id:'pg_r76', type:'pokemon', pokeId:861, name:'オーロンゲ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r77', type:'pokemon', pokeId:887, name:'ドラパルト',  rarity:'rare', premiumGacha:true },
  // Gen 9
  { id:'pg_r78', type:'pokemon', pokeId:908, name:'マスカーニャ', rarity:'rare', premiumGacha:true },
  { id:'pg_r79', type:'pokemon', pokeId:911, name:'ラウドボーン', rarity:'rare', premiumGacha:true },
  { id:'pg_r80', type:'pokemon', pokeId:914, name:'ウェーニバル', rarity:'rare', premiumGacha:true },
  { id:'pg_r81', type:'pokemon', pokeId:950, name:'テツノカイナ', rarity:'rare', premiumGacha:true },
  { id:'pg_r82', type:'pokemon', pokeId:962, name:'ガルーラ',    rarity:'rare', premiumGacha:true },

  // ── ultra (伝説・幻・色違いポケモン) ──
  // Gen 1
  { id:'pg_ult01', type:'pokemon', pokeId:144, name:'フリーザー',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult02', type:'pokemon', pokeId:145, name:'サンダー',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult03', type:'pokemon', pokeId:146, name:'ファイヤー',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult04', type:'pokemon', pokeId:150, name:'ミュウツー',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult05', type:'pokemon', pokeId:151, name:'ミュウ',      rarity:'ultra', premiumGacha:true },
  // Gen 2
  { id:'pg_ult06', type:'pokemon', pokeId:243, name:'ライコウ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult07', type:'pokemon', pokeId:244, name:'エンテイ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult08', type:'pokemon', pokeId:245, name:'スイクン',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult09', type:'pokemon', pokeId:249, name:'ルギア',      rarity:'ultra', premiumGacha:true },
  { id:'pg_ult10', type:'pokemon', pokeId:250, name:'ホウオウ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult11', type:'pokemon', pokeId:251, name:'セレビィ',    rarity:'ultra', premiumGacha:true },
  // Gen 3
  { id:'pg_ult12', type:'pokemon', pokeId:377, name:'レジロック',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult13', type:'pokemon', pokeId:378, name:'レジアイス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult14', type:'pokemon', pokeId:379, name:'レジスチル',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult15', type:'pokemon', pokeId:380, name:'ラティアス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult16', type:'pokemon', pokeId:381, name:'ラティオス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult17', type:'pokemon', pokeId:382, name:'カイオーガ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult18', type:'pokemon', pokeId:383, name:'グラードン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult19', type:'pokemon', pokeId:384, name:'レックウザ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult20', type:'pokemon', pokeId:385, name:'ジラーチ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult21', type:'pokemon', pokeId:386, name:'デオキシス',  rarity:'ultra', premiumGacha:true },
  // Gen 4
  { id:'pg_ult22', type:'pokemon', pokeId:480, name:'ユクシー',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult23', type:'pokemon', pokeId:481, name:'エムリット',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult24', type:'pokemon', pokeId:482, name:'アグノム',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult25', type:'pokemon', pokeId:483, name:'ディアルガ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult26', type:'pokemon', pokeId:484, name:'パルキア',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult27', type:'pokemon', pokeId:485, name:'ヒードラン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult28', type:'pokemon', pokeId:486, name:'レジギガス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult29', type:'pokemon', pokeId:487, name:'ギラティナ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult30', type:'pokemon', pokeId:488, name:'クレセリア',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult31', type:'pokemon', pokeId:491, name:'ダークライ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult32', type:'pokemon', pokeId:492, name:'シェイミ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult33', type:'pokemon', pokeId:493, name:'アルセウス',  rarity:'ultra', premiumGacha:true },
  // Gen 5
  { id:'pg_ult34', type:'pokemon', pokeId:494, name:'ビクティニ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult35', type:'pokemon', pokeId:638, name:'コバルオン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult36', type:'pokemon', pokeId:639, name:'テラキオン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult37', type:'pokemon', pokeId:640, name:'ビリジオン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult38', type:'pokemon', pokeId:641, name:'トルネロス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult39', type:'pokemon', pokeId:642, name:'ボルトロス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult40', type:'pokemon', pokeId:643, name:'レシラム',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult41', type:'pokemon', pokeId:644, name:'ゼクロム',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult42', type:'pokemon', pokeId:645, name:'ランドロス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult43', type:'pokemon', pokeId:646, name:'キュレム',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult44', type:'pokemon', pokeId:647, name:'ケルディオ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult45', type:'pokemon', pokeId:648, name:'メロエッタ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult46', type:'pokemon', pokeId:649, name:'ゲノセクト',  rarity:'ultra', premiumGacha:true },
  // Gen 6
  { id:'pg_ult47', type:'pokemon', pokeId:716, name:'ゼルネアス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult48', type:'pokemon', pokeId:717, name:'イベルタル',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult49', type:'pokemon', pokeId:718, name:'ジガルデ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult50', type:'pokemon', pokeId:719, name:'ディアンシー', rarity:'ultra', premiumGacha:true },
  { id:'pg_ult51', type:'pokemon', pokeId:720, name:'フーパ',      rarity:'ultra', premiumGacha:true },
  { id:'pg_ult52', type:'pokemon', pokeId:721, name:'ボルケニオン', rarity:'ultra', premiumGacha:true },
  // Gen 7
  { id:'pg_ult53', type:'pokemon', pokeId:791, name:'ソルガレオ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult54', type:'pokemon', pokeId:792, name:'ルナアーラ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult55', type:'pokemon', pokeId:800, name:'ネクロズマ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult56', type:'pokemon', pokeId:801, name:'マギアナ',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult57', type:'pokemon', pokeId:802, name:'マーシャドー', rarity:'ultra', premiumGacha:true },
  { id:'pg_ult58', type:'pokemon', pokeId:807, name:'ゼラオラ',    rarity:'ultra', premiumGacha:true },
  // Gen 8
  { id:'pg_ult59', type:'pokemon', pokeId:888, name:'ザシアン',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult60', type:'pokemon', pokeId:889, name:'ザマゼンタ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult61', type:'pokemon', pokeId:890, name:'エターナトゥス',rarity:'ultra', premiumGacha:true },
  { id:'pg_ult62', type:'pokemon', pokeId:891, name:'ウーラオス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult63', type:'pokemon', pokeId:893, name:'ザルード',    rarity:'ultra', premiumGacha:true },
  { id:'pg_ult64', type:'pokemon', pokeId:894, name:'レジエレキ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult65', type:'pokemon', pokeId:895, name:'レジドラゴ',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult66', type:'pokemon', pokeId:896, name:'ブリザポス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult67', type:'pokemon', pokeId:897, name:'レイスポス',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult68', type:'pokemon', pokeId:898, name:'バドレックス', rarity:'ultra', premiumGacha:true },
  // Gen 9
  { id:'pg_ult69', type:'pokemon', pokeId:1007,name:'コライドン',  rarity:'ultra', premiumGacha:true },
  { id:'pg_ult70', type:'pokemon', pokeId:1008,name:'ミライドン',  rarity:'ultra', premiumGacha:true },
  // 色違い (shiny)
  { id:'pg_sh01', type:'pokemon', pokeId:6,   name:'色違いリザードン', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh02', type:'pokemon', pokeId:25,  name:'色違いピカチュウ', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh03', type:'pokemon', pokeId:94,  name:'色違いゲンガー',   rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh04', type:'pokemon', pokeId:130, name:'色違いギャラドス', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh05', type:'pokemon', pokeId:149, name:'色違いカイリュー', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh06', type:'pokemon', pokeId:150, name:'色違いミュウツー', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh07', type:'pokemon', pokeId:384, name:'色違いレックウザ', rarity:'ultra', premiumGacha:true, shiny:true },
  // ── 色違い追加 ──
  { id:'pg_sh08', type:'pokemon', pokeId:245, name:'色違いスイクン',   rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh09', type:'pokemon', pokeId:249, name:'色違いルギア',     rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh10', type:'pokemon', pokeId:250, name:'色違いホウオウ',   rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh11', type:'pokemon', pokeId:380, name:'色違いラティアス', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh12', type:'pokemon', pokeId:381, name:'色違いラティオス', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh13', type:'pokemon', pokeId:448, name:'色違いルカリオ',   rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh14', type:'pokemon', pokeId:445, name:'色違いガブリアス', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh15', type:'pokemon', pokeId:483, name:'色違いディアルガ', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh16', type:'pokemon', pokeId:484, name:'色違いパルキア',   rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh17', type:'pokemon', pokeId:491, name:'色違いダークライ', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh18', type:'pokemon', pokeId:658, name:'色違いゲッコウガ', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh19', type:'pokemon', pokeId:700, name:'色違いニンフィア', rarity:'ultra', premiumGacha:true, shiny:true },
  { id:'pg_sh20', type:'pokemon', pokeId:133, name:'色違いイーブイ',   rarity:'ultra', premiumGacha:true, shiny:true },

  // ── コモン追加（Gen1-9の種/1段階目） ──
  { id:'pg_c95',  type:'pokemon', pokeId:13,  name:'ビードル',   rarity:'common', premiumGacha:true },
  { id:'pg_c96',  type:'pokemon', pokeId:19,  name:'コラッタ',   rarity:'common', premiumGacha:true },
  { id:'pg_c97',  type:'pokemon', pokeId:21,  name:'オニスズメ', rarity:'common', premiumGacha:true },
  { id:'pg_c98',  type:'pokemon', pokeId:60,  name:'ニョロモ',   rarity:'common', premiumGacha:true },
  { id:'pg_c99',  type:'pokemon', pokeId:69,  name:'マダツボミ', rarity:'common', premiumGacha:true },
  { id:'pg_c100', type:'pokemon', pokeId:72,  name:'メノクラゲ', rarity:'common', premiumGacha:true },
  { id:'pg_c101', type:'pokemon', pokeId:81,  name:'コイル',     rarity:'common', premiumGacha:true },
  { id:'pg_c102', type:'pokemon', pokeId:120, name:'ヒトデマン', rarity:'common', premiumGacha:true },
  { id:'pg_c103', type:'pokemon', pokeId:161, name:'オタチ',     rarity:'common', premiumGacha:true },
  { id:'pg_c104', type:'pokemon', pokeId:163, name:'ホーホー',   rarity:'common', premiumGacha:true },
  { id:'pg_c105', type:'pokemon', pokeId:165, name:'レディバ',   rarity:'common', premiumGacha:true },
  { id:'pg_c106', type:'pokemon', pokeId:179, name:'メリープ',   rarity:'common', premiumGacha:true },
  { id:'pg_c107', type:'pokemon', pokeId:187, name:'ハネッコ',   rarity:'common', premiumGacha:true },
  { id:'pg_c108', type:'pokemon', pokeId:190, name:'エイパム',   rarity:'common', premiumGacha:true },
  { id:'pg_c109', type:'pokemon', pokeId:194, name:'ウパー',     rarity:'common', premiumGacha:true },
  { id:'pg_c110', type:'pokemon', pokeId:218, name:'マグマッグ', rarity:'common', premiumGacha:true },
  { id:'pg_c111', type:'pokemon', pokeId:220, name:'イノプー',   rarity:'common', premiumGacha:true },
  { id:'pg_c112', type:'pokemon', pokeId:223, name:'テッポウオ', rarity:'common', premiumGacha:true },
  { id:'pg_c113', type:'pokemon', pokeId:273, name:'タネボー',   rarity:'common', premiumGacha:true },
  { id:'pg_c114', type:'pokemon', pokeId:285, name:'キノコキ',   rarity:'common', premiumGacha:true },
  { id:'pg_c115', type:'pokemon', pokeId:355, name:'カゲボウズ', rarity:'common', premiumGacha:true },
  { id:'pg_c116', type:'pokemon', pokeId:361, name:'ユキワラシ', rarity:'common', premiumGacha:true },
  { id:'pg_c117', type:'pokemon', pokeId:506, name:'ミネズミ',   rarity:'common', premiumGacha:true },
  { id:'pg_c118', type:'pokemon', pokeId:517, name:'ムンナ',     rarity:'common', premiumGacha:true },
  { id:'pg_c119', type:'pokemon', pokeId:546, name:'フォシーナ', rarity:'common', premiumGacha:true },
  { id:'pg_c120', type:'pokemon', pokeId:607, name:'ヒトモシ',   rarity:'common', premiumGacha:true },
  { id:'pg_c121', type:'pokemon', pokeId:627, name:'バルチャイ', rarity:'common', premiumGacha:true },
  { id:'pg_c122', type:'pokemon', pokeId:548, name:'チュリネ',   rarity:'common', premiumGacha:true },
  { id:'pg_c123', type:'pokemon', pokeId:619, name:'コジョフー', rarity:'common', premiumGacha:true },
  { id:'pg_c124', type:'pokemon', pokeId:667, name:'シシコ',     rarity:'common', premiumGacha:true },
  { id:'pg_c125', type:'pokemon', pokeId:704, name:'ヌメラ',     rarity:'common', premiumGacha:true },
  { id:'pg_c126', type:'pokemon', pokeId:742, name:'アブリー',   rarity:'common', premiumGacha:true },
  { id:'pg_c127', type:'pokemon', pokeId:755, name:'モルペコ',   rarity:'common', premiumGacha:true },
  { id:'pg_c128', type:'pokemon', pokeId:840, name:'カジッチュ', rarity:'common', premiumGacha:true },
  { id:'pg_c129', type:'pokemon', pokeId:848, name:'マッシブーン',rarity:'common', premiumGacha:true },
  { id:'pg_c130', type:'pokemon', pokeId:911, name:'ウパー(パルデア)',rarity:'common', premiumGacha:true },

  // ── アンコモン追加 ──
  { id:'pg_u74',  type:'pokemon', pokeId:123, name:'ストライク',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u75',  type:'pokemon', pokeId:124, name:'ルージュラ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u76',  type:'pokemon', pokeId:125, name:'エレブー',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u77',  type:'pokemon', pokeId:126, name:'ブーバー',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u78',  type:'pokemon', pokeId:127, name:'カイロス',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u79',  type:'pokemon', pokeId:128, name:'ケンタロス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u80',  type:'pokemon', pokeId:118, name:'トサキント',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u81',  type:'pokemon', pokeId:122, name:'バリヤード',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u82',  type:'pokemon', pokeId:132, name:'メタモン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u83',  type:'pokemon', pokeId:137, name:'ポリゴン',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u84',  type:'pokemon', pokeId:198, name:'ヤミカラス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u85',  type:'pokemon', pokeId:204, name:'クヌギダマ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u86',  type:'pokemon', pokeId:207, name:'グライガー',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u87',  type:'pokemon', pokeId:214, name:'ヘラクロス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u88',  type:'pokemon', pokeId:215, name:'ニューラ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u89',  type:'pokemon', pokeId:226, name:'マンタイン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u90',  type:'pokemon', pokeId:303, name:'クチート',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u91',  type:'pokemon', pokeId:313, name:'バルビート',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u92',  type:'pokemon', pokeId:314, name:'イルミーゼ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u93',  type:'pokemon', pokeId:335, name:'ザングース',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u94',  type:'pokemon', pokeId:336, name:'ハブネーク',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u95',  type:'pokemon', pokeId:337, name:'ルナトーン',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u96',  type:'pokemon', pokeId:338, name:'ソルロック',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u97',  type:'pokemon', pokeId:363, name:'タマザラシ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u98',  type:'pokemon', pokeId:408, name:'ズガイドス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u99',  type:'pokemon', pokeId:410, name:'タテトプス',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u100', type:'pokemon', pokeId:412, name:'ミノムッチ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u101', type:'pokemon', pokeId:420, name:'チェリンボ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u102', type:'pokemon', pokeId:422, name:'カラナクシ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u103', type:'pokemon', pokeId:425, name:'フワンテ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u104', type:'pokemon', pokeId:551, name:'メグロコ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u105', type:'pokemon', pokeId:557, name:'イシズマイ',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_u106', type:'pokemon', pokeId:570, name:'ゾロア',      rarity:'uncommon', premiumGacha:true },
  { id:'pg_u107', type:'pokemon', pokeId:599, name:'ギアル',      rarity:'uncommon', premiumGacha:true },
  { id:'pg_u108', type:'pokemon', pokeId:653, name:'フォッコ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u109', type:'pokemon', pokeId:661, name:'ヤヤコマ',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_u110', type:'pokemon', pokeId:688, name:'カチコール',  rarity:'uncommon', premiumGacha:true },

  // ── レア追加（最終進化） ──
  { id:'pg_r83',  type:'pokemon', pokeId:28,  name:'サンドパン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r84',  type:'pokemon', pokeId:31,  name:'ニドクイン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r85',  type:'pokemon', pokeId:45,  name:'ラフレシア',  rarity:'rare', premiumGacha:true },
  { id:'pg_r86',  type:'pokemon', pokeId:55,  name:'ゴルダック',  rarity:'rare', premiumGacha:true },
  { id:'pg_r87',  type:'pokemon', pokeId:134, name:'シャワーズ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r88',  type:'pokemon', pokeId:135, name:'サンダース',  rarity:'rare', premiumGacha:true },
  { id:'pg_r89',  type:'pokemon', pokeId:136, name:'ブースター',  rarity:'rare', premiumGacha:true },
  { id:'pg_r90',  type:'pokemon', pokeId:139, name:'オムスター',  rarity:'rare', premiumGacha:true },
  { id:'pg_r91',  type:'pokemon', pokeId:141, name:'カブトプス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r92',  type:'pokemon', pokeId:169, name:'クロバット',  rarity:'rare', premiumGacha:true },
  { id:'pg_r93',  type:'pokemon', pokeId:199, name:'ヤドキング',  rarity:'rare', premiumGacha:true },
  { id:'pg_r94',  type:'pokemon', pokeId:210, name:'グランブル',  rarity:'rare', premiumGacha:true },
  { id:'pg_r95',  type:'pokemon', pokeId:230, name:'キングドラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r96',  type:'pokemon', pokeId:232, name:'ドンファン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r97',  type:'pokemon', pokeId:233, name:'ポリゴン2',   rarity:'rare', premiumGacha:true },
  { id:'pg_r98',  type:'pokemon', pokeId:348, name:'アーマルド',  rarity:'rare', premiumGacha:true },
  { id:'pg_r99',  type:'pokemon', pokeId:426, name:'フワライド',  rarity:'rare', premiumGacha:true },
  { id:'pg_r100', type:'pokemon', pokeId:435, name:'スカタンク',  rarity:'rare', premiumGacha:true },
  { id:'pg_r101', type:'pokemon', pokeId:472, name:'グライオン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r102', type:'pokemon', pokeId:523, name:'ゼブライカ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r103', type:'pokemon', pokeId:549, name:'ドレディア',  rarity:'rare', premiumGacha:true },
  { id:'pg_r104', type:'pokemon', pokeId:565, name:'アバゴーラ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r105', type:'pokemon', pokeId:567, name:'アーケオス',  rarity:'rare', premiumGacha:true },
  { id:'pg_r106', type:'pokemon', pokeId:571, name:'ゾロアーク',  rarity:'rare', premiumGacha:true },
  { id:'pg_r107', type:'pokemon', pokeId:581, name:'スワンナ',    rarity:'rare', premiumGacha:true },
  { id:'pg_r108', type:'pokemon', pokeId:589, name:'シュバルゴ',  rarity:'rare', premiumGacha:true },
  { id:'pg_r109', type:'pokemon', pokeId:623, name:'ゴルーグ',    rarity:'rare', premiumGacha:true },
  { id:'pg_r110', type:'pokemon', pokeId:628, name:'ウォーグル',  rarity:'rare', premiumGacha:true },
  { id:'pg_r111', type:'pokemon', pokeId:706, name:'ヌメルゴン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r112', type:'pokemon', pokeId:738, name:'クワガノン',  rarity:'rare', premiumGacha:true },
  { id:'pg_r113', type:'pokemon', pokeId:743, name:'リボンベ',    rarity:'rare', premiumGacha:true },
  { id:'pg_r114', type:'pokemon', pokeId:763, name:'ナッシー(アローラ)',rarity:'rare', premiumGacha:true },
  { id:'pg_r115', type:'pokemon', pokeId:826, name:'フォクスライ',rarity:'rare', premiumGacha:true },

  // ══ スタンプ追加（pg_st04〜pg_st43）══
  // 食べ物
  { id:'pg_st04', type:'stamp', emoji:'🍜', name:'ラーメン',     rarity:'common',   premiumGacha:true },
  { id:'pg_st05', type:'stamp', emoji:'🍣', name:'お寿司',       rarity:'common',   premiumGacha:true },
  { id:'pg_st06', type:'stamp', emoji:'🍰', name:'ケーキ',       rarity:'common',   premiumGacha:true },
  { id:'pg_st07', type:'stamp', emoji:'🍕', name:'ピザ',         rarity:'common',   premiumGacha:true },
  { id:'pg_st08', type:'stamp', emoji:'🍔', name:'バーガー',     rarity:'common',   premiumGacha:true },
  { id:'pg_st09', type:'stamp', emoji:'🍩', name:'ドーナツ',     rarity:'common',   premiumGacha:true },
  { id:'pg_st10', type:'stamp', emoji:'🧇', name:'ワッフル',     rarity:'common',   premiumGacha:true },
  { id:'pg_st11', type:'stamp', emoji:'🍪', name:'クッキー',     rarity:'common',   premiumGacha:true },
  // 自然
  { id:'pg_st12', type:'stamp', emoji:'🌸', name:'桜',           rarity:'common',   premiumGacha:true },
  { id:'pg_st13', type:'stamp', emoji:'🌺', name:'ハイビスカス', rarity:'common',   premiumGacha:true },
  { id:'pg_st14', type:'stamp', emoji:'🍁', name:'紅葉',         rarity:'common',   premiumGacha:true },
  { id:'pg_st15', type:'stamp', emoji:'🌊', name:'波',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st16', type:'stamp', emoji:'⛰️', name:'山',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st17', type:'stamp', emoji:'🌈', name:'虹',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st18', type:'stamp', emoji:'🌙', name:'月',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st19', type:'stamp', emoji:'⭐', name:'スター',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_st20', type:'stamp', emoji:'🌻', name:'ひまわり',     rarity:'common',   premiumGacha:true },
  { id:'pg_st21', type:'stamp', emoji:'🌵', name:'サボテン',     rarity:'common',   premiumGacha:true },
  // スポーツ/趣味
  { id:'pg_st22', type:'stamp', emoji:'⚽', name:'サッカー',     rarity:'common',   premiumGacha:true },
  { id:'pg_st23', type:'stamp', emoji:'🎯', name:'ダーツ',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_st24', type:'stamp', emoji:'🏆', name:'トロフィー',   rarity:'uncommon', premiumGacha:true },
  { id:'pg_st25', type:'stamp', emoji:'🎮', name:'ゲーム',       rarity:'common',   premiumGacha:true },
  { id:'pg_st26', type:'stamp', emoji:'🎸', name:'ギター',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_st27', type:'stamp', emoji:'🎤', name:'マイク',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_st28', type:'stamp', emoji:'🎨', name:'アート',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_st29', type:'stamp', emoji:'📚', name:'読書',         rarity:'common',   premiumGacha:true },
  { id:'pg_st30', type:'stamp', emoji:'🚀', name:'ロケット',     rarity:'rare',     premiumGacha:true },
  // モチベ
  { id:'pg_st31', type:'stamp', emoji:'💪', name:'筋肉',         rarity:'common',   premiumGacha:true },
  { id:'pg_st32', type:'stamp', emoji:'❤️', name:'ハート',       rarity:'common',   premiumGacha:true },
  { id:'pg_st33', type:'stamp', emoji:'🔥', name:'炎',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st34', type:'stamp', emoji:'💯', name:'100点',        rarity:'uncommon', premiumGacha:true },
  { id:'pg_st35', type:'stamp', emoji:'✨', name:'キラキラ',     rarity:'uncommon', premiumGacha:true },
  { id:'pg_st36', type:'stamp', emoji:'🎉', name:'パーティー',   rarity:'uncommon', premiumGacha:true },
  { id:'pg_st37', type:'stamp', emoji:'🙏', name:'感謝',         rarity:'common',   premiumGacha:true },
  { id:'pg_st38', type:'stamp', emoji:'💎', name:'ダイヤ',       rarity:'rare',     premiumGacha:true },
  { id:'pg_st39', type:'stamp', emoji:'👑', name:'王冠',         rarity:'rare',     premiumGacha:true },
  { id:'pg_st40', type:'stamp', emoji:'🦁', name:'ライオン',     rarity:'rare',     premiumGacha:true },
  { id:'pg_st41', type:'stamp', emoji:'⚡', name:'雷',           rarity:'uncommon', premiumGacha:true },
  { id:'pg_st42', type:'stamp', emoji:'🌟', name:'輝く星',       rarity:'rare',     premiumGacha:true },
  { id:'pg_st43', type:'stamp', emoji:'🎖️', name:'メダル',       rarity:'rare',     premiumGacha:true },

  // ══ 称号追加（pg_t07〜pg_t46）══
  { id:'pg_t07',  type:'title', name:'場の主人公',       color:'#E91E63', bg:'#FCE4EC', rarity:'common',   premiumGacha:true },
  { id:'pg_t08',  type:'title', name:'空気を読む人',     color:'#9C27B0', bg:'#F3E5F5', rarity:'common',   premiumGacha:true },
  { id:'pg_t09',  type:'title', name:'静かな自信',       color:'#3F51B5', bg:'#E8EAF6', rarity:'common',   premiumGacha:true },
  { id:'pg_t10',  type:'title', name:'温かい言葉遣い',   color:'#FF9800', bg:'#FFF3E0', rarity:'common',   premiumGacha:true },
  { id:'pg_t11',  type:'title', name:'行動する人',       color:'#4CAF50', bg:'#E8F5E9', rarity:'common',   premiumGacha:true },
  { id:'pg_t12',  type:'title', name:'努力家',           color:'#795548', bg:'#EFEBE9', rarity:'common',   premiumGacha:true },
  { id:'pg_t13',  type:'title', name:'継続の達人',       color:'#00BCD4', bg:'#E0F7FA', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t14',  type:'title', name:'早起きの人',       color:'#FFC107', bg:'#FFFDE7', rarity:'common',   premiumGacha:true },
  { id:'pg_t15',  type:'title', name:'読書家',           color:'#607D8B', bg:'#ECEFF1', rarity:'common',   premiumGacha:true },
  { id:'pg_t16',  type:'title', name:'感情の観察者',     color:'#673AB7', bg:'#EDE7F6', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t17',  type:'title', name:'夜型の賢者',       color:'#1A237E', bg:'#E8EAF6', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t18',  type:'title', name:'朝型の戦士',       color:'#E65100', bg:'#FBE9E7', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t19',  type:'title', name:'人を見る目',       color:'#2E7D32', bg:'#E8F5E9', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t20',  type:'title', name:'最高の聞き手',     color:'#0277BD', bg:'#E1F5FE', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t21',  type:'title', name:'言葉の職人',       color:'#558B2F', bg:'#F1F8E9', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t22',  type:'title', name:'場を作る者',       color:'#6A1B9A', bg:'#F3E5F5', rarity:'rare',     premiumGacha:true },
  { id:'pg_t23',  type:'title', name:'孤独の克服者',     color:'#BF360C', bg:'#FBE9E7', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t24',  type:'title', name:'習慣の鬼',         color:'#1B5E20', bg:'#E8F5E9', rarity:'rare',     premiumGacha:true },
  { id:'pg_t25',  type:'title', name:'自己管理の達人',   color:'#0D47A1', bg:'#E3F2FD', rarity:'rare',     premiumGacha:true },
  { id:'pg_t26',  type:'title', name:'メンタル最強',     color:'#212121', bg:'#F5F5F5', rarity:'rare',     premiumGacha:true },
  { id:'pg_t27',  type:'title', name:'仮面のカリスマ',   color:'#880E4F', bg:'#FCE4EC', rarity:'rare',     premiumGacha:true },
  { id:'pg_t28',  type:'title', name:'進化する人間',     color:'#4A148C', bg:'#F3E5F5', rarity:'rare',     premiumGacha:true },
  { id:'pg_t29',  type:'title', name:'価値の伝道師',     color:'#E65100', bg:'#FFF8E1', rarity:'rare',     premiumGacha:true },
  { id:'pg_t30',  type:'title', name:'感謝の達人',       color:'#006064', bg:'#E0F7FA', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t31',  type:'title', name:'一週間の勇者',     color:'#FF6F00', bg:'#FFF8E1', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t32',  type:'title', name:'深夜の哲学者',     color:'#1A237E', bg:'#E8EAF6', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t33',  type:'title', name:'ストレス免疫',     color:'#37474F', bg:'#ECEFF1', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t34',  type:'title', name:'余裕の象徴',       color:'#4E342E', bg:'#EFEBE9', rarity:'rare',     premiumGacha:true },
  { id:'pg_t35',  type:'title', name:'本物の優しさ',     color:'#AD1457', bg:'#FCE4EC', rarity:'rare',     premiumGacha:true },
  { id:'pg_t36',  type:'title', name:'睡眠マスター',     color:'#00838F', bg:'#E0F7FA', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t37',  type:'title', name:'自己投資家',       color:'#558B2F', bg:'#F1F8E9', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t38',  type:'title', name:'日記の達人',       color:'#5D4037', bg:'#EFEBE9', rarity:'uncommon', premiumGacha:true },
  { id:'pg_t39',  type:'title', name:'感情の錬金術師',   color:'#7B1FA2', bg:'#F3E5F5', rarity:'rare',     premiumGacha:true },
  { id:'pg_t40',  type:'title', name:'英雄の予備軍',     color:'#1565C0', bg:'#E3F2FD', rarity:'rare',     premiumGacha:true },
  { id:'pg_t41',  type:'title', name:'完璧な一日の主',   color:'#C62828', bg:'#FFEBEE', rarity:'ultra',    premiumGacha:true },
  { id:'pg_t42',  type:'title', name:'伝説の記録者',     color:'#E65100', bg:'#FFF3E0', rarity:'ultra',    premiumGacha:true },
  { id:'pg_t43',  type:'title', name:'真の成長者',       color:'#1B5E20', bg:'#E8F5E9', rarity:'ultra',    premiumGacha:true },
  { id:'pg_t44',  type:'title', name:'習慣の神',         color:'#311B92', bg:'#EDE7F6', rarity:'ultra',    premiumGacha:true },
  { id:'pg_t45',  type:'title', name:'人生の設計士',     color:'#004D40', bg:'#E0F2F1', rarity:'ultra',    premiumGacha:true },
  { id:'pg_t46',  type:'title', name:'場を支配する者',   color:'#BF360C', bg:'#FBE9E7', rarity:'ultra',    premiumGacha:true },

  // ══ フレーム追加（pg_fr04〜pg_fr23）══
  { id:'pg_fr04',  type:'frame', name:'シンプルネイビー',  cssClass:'frame-navy',    rarity:'common',   premiumGacha:true },
  { id:'pg_fr05',  type:'frame', name:'ミントグリーン',    cssClass:'frame-mint',    rarity:'common',   premiumGacha:true },
  { id:'pg_fr06',  type:'frame', name:'コーラルピンク',    cssClass:'frame-coral',   rarity:'common',   premiumGacha:true },
  { id:'pg_fr07',  type:'frame', name:'サンセットオレンジ',cssClass:'frame-sunset',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr08',  type:'frame', name:'ディープパープル',  cssClass:'frame-deep-purple', rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr09',  type:'frame', name:'エメラルド',        cssClass:'frame-emerald', rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr10',  type:'frame', name:'チェリーブロッサム',cssClass:'frame-cherry',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr11',  type:'frame', name:'ミッドナイト',      cssClass:'frame-midnight',rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr12',  type:'frame', name:'ローズゴールド',    cssClass:'frame-rose-gold',rarity:'rare',    premiumGacha:true },
  { id:'pg_fr13',  type:'frame', name:'オーロラ',          cssClass:'frame-aurora',  rarity:'rare',     premiumGacha:true },
  { id:'pg_fr14',  type:'frame', name:'チタニウム',        cssClass:'frame-titanium',rarity:'rare',     premiumGacha:true },
  { id:'pg_fr15',  type:'frame', name:'ドラゴンスケール',  cssClass:'frame-dragon',  rarity:'rare',     premiumGacha:true },
  { id:'pg_fr16',  type:'frame', name:'フォレスト',        cssClass:'frame-forest',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr17',  type:'frame', name:'アクアマリン',      cssClass:'frame-aqua',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr18',  type:'frame', name:'スターダスト',      cssClass:'frame-stardust',rarity:'rare',     premiumGacha:true },
  { id:'pg_fr19',  type:'frame', name:'ネオン',            cssClass:'frame-neon',    rarity:'rare',     premiumGacha:true },
  { id:'pg_fr20',  type:'frame', name:'ヴィンテージ',      cssClass:'frame-vintage', rarity:'uncommon', premiumGacha:true },
  { id:'pg_fr21',  type:'frame', name:'クリスタル',        cssClass:'frame-crystal', rarity:'ultra',    premiumGacha:true },
  { id:'pg_fr22',  type:'frame', name:'ホログラム',        cssClass:'frame-hologram',rarity:'ultra',    premiumGacha:true },
  { id:'pg_fr23',  type:'frame', name:'神話の枠',          cssClass:'frame-myth',    rarity:'ultra',    premiumGacha:true },

  // ══ エフェクト追加（pg_ef04〜pg_ef18）══
  { id:'pg_ef04',  type:'effect', name:'桜吹雪',           cssClass:'ef-sakura',     rarity:'uncommon', premiumGacha:true },
  { id:'pg_ef05',  type:'effect', name:'バブル',           cssClass:'ef-bubble',     rarity:'common',   premiumGacha:true },
  { id:'pg_ef06',  type:'effect', name:'炎のオーラ',       cssClass:'ef-fire-aura',  rarity:'rare',     premiumGacha:true },
  { id:'pg_ef07',  type:'effect', name:'雷撃',             cssClass:'ef-thunder',    rarity:'rare',     premiumGacha:true },
  { id:'pg_ef08',  type:'effect', name:'水流',             cssClass:'ef-water-flow', rarity:'uncommon', premiumGacha:true },
  { id:'pg_ef09',  type:'effect', name:'葉っぱ舞い',       cssClass:'ef-leaves',     rarity:'common',   premiumGacha:true },
  { id:'pg_ef10',  type:'effect', name:'雪結晶',           cssClass:'ef-snow',       rarity:'uncommon', premiumGacha:true },
  { id:'pg_ef11',  type:'effect', name:'虹の輝き',         cssClass:'ef-rainbow',    rarity:'rare',     premiumGacha:true },
  { id:'pg_ef12',  type:'effect', name:'宇宙',             cssClass:'ef-cosmos',     rarity:'ultra',    premiumGacha:true },
  { id:'pg_ef13',  type:'effect', name:'ダイヤモンドダスト',cssClass:'ef-diamond-dust',rarity:'ultra',  premiumGacha:true },
  { id:'pg_ef14',  type:'effect', name:'フェニックス',     cssClass:'ef-phoenix',    rarity:'ultra',    premiumGacha:true },
  { id:'pg_ef15',  type:'effect', name:'光子嵐',           cssClass:'ef-photon',     rarity:'ultra',    premiumGacha:true },
  { id:'pg_ef16',  type:'effect', name:'月光',             cssClass:'ef-moonlight',  rarity:'rare',     premiumGacha:true },
  { id:'pg_ef17',  type:'effect', name:'時空の歪み',       cssClass:'ef-spacetime',  rarity:'ultra',    premiumGacha:true },
  { id:'pg_ef18',  type:'effect', name:'勝利の閃光',       cssClass:'ef-victory',    rarity:'rare',     premiumGacha:true },

  // ══ 背景・壁紙追加（pg_bg03〜pg_bg22）══
  // 通常背景
  { id:'pg_bg03',  type:'bg', name:'夕焼け空',         cssClass:'bg-sunset',      rarity:'common',   premiumGacha:true },
  { id:'pg_bg04',  type:'bg', name:'深海',             cssClass:'bg-deep-sea',    rarity:'uncommon', premiumGacha:true },
  { id:'pg_bg05',  type:'bg', name:'森の朝',           cssClass:'bg-forest-dawn', rarity:'common',   premiumGacha:true },
  { id:'pg_bg06',  type:'bg', name:'雪景色',           cssClass:'bg-snowscape',   rarity:'uncommon', premiumGacha:true },
  { id:'pg_bg07',  type:'bg', name:'砂漠の星空',       cssClass:'bg-desert-stars',rarity:'rare',     premiumGacha:true },
  { id:'pg_bg08',  type:'bg', name:'都市の夜景',       cssClass:'bg-city-night',  rarity:'rare',     premiumGacha:true },
  { id:'pg_bg09',  type:'bg', name:'春の桜並木',       cssClass:'bg-sakura-alley',rarity:'uncommon', premiumGacha:true },
  { id:'pg_bg10',  type:'bg', name:'宇宙',             cssClass:'bg-space',       rarity:'ultra',    premiumGacha:true },
  // ポケモン風壁紙
  { id:'pg_bg11',  type:'bg', name:'草原フィールド',   cssClass:'bg-poke-grass',  rarity:'common',   premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg12',  type:'bg', name:'炎の山道',         cssClass:'bg-poke-fire',   rarity:'uncommon', premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg13',  type:'bg', name:'海洋コロシアム',   cssClass:'bg-poke-water',  rarity:'uncommon', premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg14',  type:'bg', name:'電気の洞窟',       cssClass:'bg-poke-electric',rarity:'uncommon',premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg15',  type:'bg', name:'幻の森',           cssClass:'bg-poke-psychic',rarity:'rare',     premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg16',  type:'bg', name:'氷の神殿',         cssClass:'bg-poke-ice',    rarity:'rare',     premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg17',  type:'bg', name:'竜の巣',           cssClass:'bg-poke-dragon', rarity:'rare',     premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg18',  type:'bg', name:'霊峰サミット',     cssClass:'bg-poke-ghost',  rarity:'rare',     premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg19',  type:'bg', name:'伝説のピーク',     cssClass:'bg-poke-legend', rarity:'ultra',    premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg20',  type:'bg', name:'マスターリーグ',   cssClass:'bg-poke-master', rarity:'ultra',    premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg21',  type:'bg', name:'空の柱',           cssClass:'bg-poke-sky',    rarity:'ultra',    premiumGacha:true, pokemonThemed:true },
  { id:'pg_bg22',  type:'bg', name:'時空の彼方',       cssClass:'bg-poke-space',  rarity:'ultra',    premiumGacha:true, pokemonThemed:true },

  // ══ アクセサリー追加（pg_ac02〜pg_ac21）══
  { id:'pg_ac02',  type:'accessory', name:'バトルバッジ',   cssClass:'ac-battle-badge',rarity:'uncommon', premiumGacha:true },
  { id:'pg_ac03',  type:'accessory', name:'リボン',         cssClass:'ac-ribbon',       rarity:'common',   premiumGacha:true },
  { id:'pg_ac04',  type:'accessory', name:'ポケボール帽子', cssClass:'ac-pokeball-cap', rarity:'uncommon', premiumGacha:true },
  { id:'pg_ac05',  type:'accessory', name:'英雄のマント',   cssClass:'ac-hero-cloak',   rarity:'rare',     premiumGacha:true },
  { id:'pg_ac06',  type:'accessory', name:'魔法の杖',       cssClass:'ac-magic-wand',   rarity:'rare',     premiumGacha:true },
  { id:'pg_ac07',  type:'accessory', name:'知恵の眼鏡',     cssClass:'ac-smart-glasses',rarity:'uncommon', premiumGacha:true },
  { id:'pg_ac08',  type:'accessory', name:'勇者の剣',       cssClass:'ac-hero-sword',   rarity:'rare',     premiumGacha:true },
  { id:'pg_ac09',  type:'accessory', name:'羽根',           cssClass:'ac-feather',      rarity:'common',   premiumGacha:true },
  { id:'pg_ac10',  type:'accessory', name:'翼',             cssClass:'ac-wings',        rarity:'rare',     premiumGacha:true },
  { id:'pg_ac11',  type:'accessory', name:'スカーフ',       cssClass:'ac-scarf',        rarity:'common',   premiumGacha:true },
  { id:'pg_ac12',  type:'accessory', name:'伝説のメダル',   cssClass:'ac-legend-medal', rarity:'ultra',    premiumGacha:true },
  { id:'pg_ac13',  type:'accessory', name:'王者の指輪',     cssClass:'ac-champion-ring',rarity:'ultra',    premiumGacha:true },
  { id:'pg_ac14',  type:'accessory', name:'ダイヤの勲章',   cssClass:'ac-diamond-badge',rarity:'ultra',    premiumGacha:true },
  { id:'pg_ac15',  type:'accessory', name:'エナジーコア',   cssClass:'ac-energy-core',  rarity:'rare',     premiumGacha:true },
  { id:'pg_ac16',  type:'accessory', name:'炎の腕輪',       cssClass:'ac-fire-band',    rarity:'rare',     premiumGacha:true },
  { id:'pg_ac17',  type:'accessory', name:'氷の冠',         cssClass:'ac-ice-crown',    rarity:'rare',     premiumGacha:true },
  { id:'pg_ac18',  type:'accessory', name:'闇の護符',       cssClass:'ac-dark-charm',   rarity:'uncommon', premiumGacha:true },
  { id:'pg_ac19',  type:'accessory', name:'光の護符',       cssClass:'ac-light-charm',  rarity:'uncommon', premiumGacha:true },
  { id:'pg_ac20',  type:'accessory', name:'伝説のボール',   cssClass:'ac-legend-ball',  rarity:'ultra',    premiumGacha:true },
  { id:'pg_ac21',  type:'accessory', name:'マスタークラウン',cssClass:'ac-master-crown', rarity:'ultra',   premiumGacha:true },
]

// プレミアムガチャ解放済み管理
export function getPremiumUnlocked() {
  try { return JSON.parse(localStorage.getItem('premiumUnlocked')) || [] } catch { return [] }
}
export function addPremiumUnlocked(id) {
  const list = getPremiumUnlocked()
  if (!list.includes(id)) { list.push(id); localStorage.setItem('premiumUnlocked', JSON.stringify(list)) }
}

/* ─── ユーティリティ ─── */
export function isUnlocked(item, streak, perfect = 0) {
  if (item.perfectCount != null) return perfect >= item.perfectCount
  if (item.perfectReq) return perfect >= item.perfectReq
  if (item.premiumGacha) {
    try { return (JSON.parse(localStorage.getItem('premiumUnlocked')) || []).includes(item.id) } catch { return false }
  }
  const req = item.day ?? item.streakReq ?? 0
  return req <= streak
}

export function getAllRewardsAtDay(day) {
  return TIMELINE.filter(r => r.day === day)
}

const EQ_KEY = 'auraEquipped3'
export function getEquipped() {
  try { return JSON.parse(localStorage.getItem(EQ_KEY)) || {} } catch { return {} }
}
export function saveEquipped(data) {
  localStorage.setItem(EQ_KEY, JSON.stringify(data))
}
