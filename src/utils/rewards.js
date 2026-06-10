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
   ・序盤ボーナス  : day 0（スタート）+ day 1〜10（毎日1体）
   ・メイン進行   : day 20, 30, 40 … 360（10日ごと）
   ・perfect専用  : 別枠
   各地方・最新作まで幅広く
───────────────────────────────────────────────────────────── */

// [id, pokeId, name, day]
const POKE_STARTER = ['pichu', 172, 'ピチュー', 0]   // day 0

// 序盤ボーナス：day 1〜10 (毎日もらえる / 各地方から人気どころ)
const POKE_EARLY = [
  ['togepi',     175, 'タマゴラス',   1],  // ジョウト
  ['marill',     183, 'マリル',       2],  // ジョウト
  ['mudkip',     258, 'ミズゴロウ',   3],  // ホウエン
  ['piplup',     393, 'ポッチャマ',   4],  // シンオウ
  ['oshawott',   501, 'ミジュマル',   5],  // イッシュ
  ['fennekin',   653, 'フォッコ',     6],  // カロス
  ['rowlet',     722, 'モクロー',     7],  // アローラ
  ['sobble',     816, 'メッソン',     8],  // ガラル
  ['sprigatito', 906, 'ニャオハ',     9],  // パルデア(最新)
  ['mimikyu',    778, 'ミミッキュ',  10],  // アローラ(人気)
]

// メイン進行：day 20〜360（10日ごと / 各地方の強・人気ポケモン）
const POKE_MAIN = [
  ['pikachu',    25,  'ピカチュウ',  20],  // カントー
  ['gengar',     94,  'ゲンガー',    30],  // カントー
  ['eevee',     133,  'イーブイ',    40],  // カントー
  ['snorlax',   143,  'カビゴン',    50],  // カントー
  ['dragonite', 149,  'カイリュー',  60],  // カントー
  ['mewtwo',    150,  'ミュウツー',  70],  // カントー
  ['charizard',   6,  'リザードン',  80],  // カントー
  ['ampharos',  181,  'デンリュウ',  90],  // ジョウト
  ['scizor',    212,  'ハッサム',   100],  // ジョウト
  ['tyranitar', 248,  'バンギラス', 110],  // ジョウト
  ['lugia',     249,  'ルギア',     120],  // ジョウト
  ['ho_oh',     250,  'ホウオウ',   130],  // ジョウト
  ['blaziken',  257,  'バシャーモ', 140],  // ホウエン
  ['gardevoir', 282,  'サーナイト', 150],  // ホウエン
  ['metagross', 376,  'メタグロス', 160],  // ホウエン
  ['rayquaza',  384,  'レックウザ', 170],  // ホウエン
  ['lucario',   448,  'ルカリオ',   180],  // シンオウ
  ['garchomp',  445,  'ガブリアス', 190],  // シンオウ
  ['giratina',  487,  'ギラティナ', 200],  // シンオウ
  ['arceus',    493,  'アルセウス', 210],  // シンオウ
  ['zoroark',   571,  'ゾロアーク', 220],  // イッシュ
  ['hydreigon', 635,  'サザンドラ', 230],  // イッシュ
  ['zekrom',    644,  'ゼクロム',   240],  // イッシュ
  ['greninja',  658,  'ゲッコウガ', 250],  // カロス
  ['aegislash', 681,  'ギルガルド', 260],  // カロス
  ['sylveon',   700,  'ニンフィア', 270],  // カロス
  ['decidueye', 724,  'ジュナイパー',280], // アローラ
  ['lycanroc',  745,  'ルガルガン', 290],  // アローラ
  ['toxtricity',849,  'ストリンダー',300], // ガラル
  ['dragapult', 887,  'ドラパルト', 310],  // ガラル
  ['zacian',    888,  'ザシアン',   320],  // ガラル
  ['meowscarada',908, 'マスカーニャ',330], // パルデア(最新)
  ['skeledirge',911,  'ラウドボーン',340], // パルデア(最新)
  ['quaquaval', 914,  'ウェーニバル',350], // パルデア(最新)
  ['koraidon',  1007, 'コライドン', 360],  // パルデア(最新・伝説)
]

const POKE_PERFECT = [
  // perfect専用（達成日数で解放）
  ['espeon',   196, 'エーフィ',    3 ],   // ジョウト
  ['umbreon',  197, 'ブラッキー',  7 ],   // ジョウト
  ['celebi',   251, 'セレビィ',    15],   // ジョウト
  ['jirachi',  385, 'ジラーチ',    30],   // ホウエン
  ['mew',      151, 'ミュウ',      50],   // カントー
  ['miraidon', 1008,'ミライドン',  100],  // パルデア(最新・伝説)
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

// 変換ヘルパー
const toTitles  = () => TITLES_RAW.map(([id,label,color]) => ({ id, label, color, type:'title' }))
const toBgs     = () => BGS_RAW.map(([id,label,bg]) => ({ id, label, bg, type:'bg' }))
const toFrames  = () => FRAMES_RAW.map(([id,label,border,shadow,cssClass]) => ({
  id, label, type:'frame',
  ...(cssClass ? { cssClass } : { style:{ border, boxShadow:shadow } })
}))
const toAccs    = () => ACCS_RAW.map(([id,label,emoji,posKey]) => ({ id, label, emoji, pos: ACC_POS[posKey]||{}, type:'acc' }))
const toStamps  = () => STAMPS_RAW.map(([id,label,emoji,bg]) => ({ id, label, emoji, stampBg:bg, type:'stamp' }))
const toEffects = () => EFFECTS.map(([id,label,cssClass]) => ({ id, label, cssClass, type:'effect' }))
const mkPoke    = ([id,pokeId,name,day]) => ({ id, pokeId, name, type:'pokemon', day })

function buildTimeline() {
  const titles  = toTitles()
  const bgs     = toBgs()
  const frames  = toFrames()
  const accs    = toAccs()
  const stamps  = toStamps()
  const effects = toEffects()

  // ポケモンが存在する日のセット
  const pokeDays = new Set([
    0,
    ...POKE_EARLY.map(p => p[3]),   // 1〜10
    ...POKE_MAIN.map(p => p[3]),    // 20,30,40...360
  ])

  const timeline = []
  // Day 0: スターター
  timeline.push(mkPoke(POKE_STARTER))
  // Day 1〜10: 序盤ボーナスポケモン
  POKE_EARLY.forEach(p => timeline.push(mkPoke(p)))
  // Day 20〜360: メイン進行ポケモン
  POKE_MAIN.forEach(p => timeline.push(mkPoke(p)))

  // 残りの日（ポケモン以外）をサイクルで埋める
  // サイクル: [title, bg, frame, acc, stamp] × 6 + effect = 31
  const cycle = []
  for (let i = 0; i < 6; i++) cycle.push('title','bg','frame','acc','stamp')
  cycle.push('effect')
  const idx = { title:0, bg:0, frame:0, acc:0, stamp:0, effect:0 }
  let cyclePos = 0

  for (let day = 1; day <= 365; day++) {
    if (pokeDays.has(day)) continue  // ポケモンの日はスキップ
    const type = cycle[cyclePos % cycle.length]
    cyclePos++
    const arr = { title:titles, bg:bgs, frame:frames, acc:accs, stamp:stamps, effect:effects }[type] || titles
    const item = arr[idx[type] % arr.length]
    idx[type]++
    timeline.push({ day, ...item })
  }

  return timeline.sort((a,b) => a.day - b.day)
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
  return def ? [def, ...items] : items
}

export const POKEMON_REWARDS = [
  mkPoke(POKE_STARTER),
  ...POKE_EARLY.map(mkPoke),
  ...POKE_MAIN.map(mkPoke),
]
export const FRAME_REWARDS     = listFor('frame')
export const ACCESSORY_REWARDS = listFor('acc')
export const BG_REWARDS        = listFor('bg')
export const TITLE_REWARDS     = [
  _defaults.title,
  ...listFor('title'),
  ...PERFECT_TITLES.map(([id,label,color,pReq,rainbow]) => ({ id, label, color, rainbow, type:'title', perfectReq:pReq })),
]
export const EFFECT_REWARDS = listFor('effect')
export const STAMP_REWARDS  = listFor('stamp')

export const PERFECT_POKEMON = POKE_PERFECT.map(([id,pokeId,name,pReq]) => ({
  id, pokeId, name, type:'pokemon', day:0, perfectReq:pReq
}))

/* ─── ユーティリティ ─── */
export function isUnlocked(item, streak, perfect = 0) {
  if (item.perfectReq) return perfect >= item.perfectReq
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
