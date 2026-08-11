const major = [
  ['00','The Fool','00_The_Fool.png',['beginnings','innocence','spontaneity','free spirit'],['recklessness','holding back','poor timing'],'A leap into the unknown: openness, curiosity and the willingness to begin before every answer is available.','A beginning may be blocked, rushed or treated too casually. Pause long enough to distinguish courage from carelessness.',['cliff edge','small companion','open sky']],
  ['01','The Magician','01_The_Magician.png',['manifestation','resourcefulness','power','inspired action'],['manipulation','untapped ability','scattered energy'],'You have tools, attention and agency available. The card asks you to focus them deliberately instead of waiting for momentum to appear by itself.','Skill can turn into performance, manipulation or unused potential when intention and action stop matching.',['raised wand','four suit tools','infinity']],
  ['02','The High Priestess','02_The_High_Priestess.png',['intuition','mystery','inner knowing','stillness'],['secrets','disconnection','silenced intuition'],'Knowledge is present beneath the obvious surface. Slow down, observe and allow intuition to inform what analysis alone cannot settle.','Inner signals may be ignored, hidden or confused with fear. Create enough quiet to tell the difference.',['pillars','moon','veil']],
  ['03','The Empress','03_The_Empress.png',['abundance','nurturing','creativity','sensuality'],['creative block','dependence','self-neglect'],'Growth comes through care, embodiment and sustained nourishment. Create conditions in which people, ideas or projects can genuinely flourish.','Care can become depletion, overprotection or creative stagnation when your own needs disappear from the equation.',['crown','grain','Venus shield']],
  ['04','The Emperor','04_The_Emperor.png',['authority','structure','stability','leadership'],['rigidity','control','domination'],'Order, boundaries and responsibility create a framework strong enough to support action. Lead by making expectations clear.','Structure may have hardened into control, inflexibility or fear of losing authority.',['throne','ram imagery','stone']],
  ['05','The Hierophant','05_The_Hierophant.png',['tradition','teaching','beliefs','institutions'],['conformity','rebellion','personal belief'],'Shared systems, teachers and traditions can offer useful structure. Understand the framework before deciding what to keep.','Inherited rules may need examination. Rejecting convention reflexively can be as limiting as obeying it blindly.',['keys','ritual','teacher']],
  ['06','The Lovers','06_The_Lovers.png',['love','alignment','choice','values'],['disharmony','misalignment','avoidance'],'Connection becomes meaningful when desire, values and choice point in the same direction. This card is as much about alignment as romance.','A relationship or decision may reveal conflicting values, avoidance or a gap between what you want and what you choose.',['paired figures','union','choice']],
  ['07','The Chariot','07_The_Chariot.png',['willpower','direction','determination','victory'],['loss of control','aggression','scattered drive'],'Progress comes from directing competing forces toward one chosen destination. Discipline matters more than raw speed.','Momentum can fragment when control becomes force or when opposing impulses pull in different directions.',['vehicle','opposing forces','armor']],
  ['08','Strength','08_Strength.png',['courage','compassion','inner strength','patience'],['self-doubt','force','raw emotion'],'Real strength is regulated rather than explosive: courage joined with gentleness, restraint and trust in your own capacity.','Confidence may be low, or pressure may be handled through force instead of steadiness.',['lion','infinity','gentle restraint']],
  ['09','The Hermit','09_The_Hermit.png',['solitude','reflection','inner guidance','wisdom'],['isolation','withdrawal','avoidance'],'Step away from noise long enough to hear your own thinking. Solitude is useful here when it creates clarity rather than escape.','Reflection may have become isolation, avoidance or reluctance to re-enter the world with what you have learned.',['lantern','staff','mountain']],
  ['10','Wheel of Fortune','10_Wheel_of_Fortune.png',['cycles','change','turning point','fortune'],['resistance','setback','repeating pattern'],'Conditions are moving. Notice the larger cycle and respond intelligently to what is changing rather than assuming the present state is permanent.','A cycle may feel stalled or repetitive, especially if change is being resisted or old patterns are being replayed.',['wheel','cycle','four directions']],
  ['11','Justice','11_Justice.png',['fairness','truth','accountability','cause and effect'],['bias','avoidance','unfairness'],'Look clearly at facts, consequences and responsibility. A balanced decision requires both honesty and proportion.','Accountability may be avoided, information distorted or a decision influenced by imbalance.',['scales','sword','symmetry']],
  ['12','The Hanged Man','12_The_Hanged_Man.png',['pause','surrender','new perspective','release'],['stalling','resistance','martyrdom'],'Progress may require suspension rather than force. Let the old angle loosen so another perspective can become visible.','A useful pause can turn into indefinite waiting, resistance or sacrifice without purpose.',['suspension','halo','inversion']],
  ['13','Death','13_Death.png',['ending','transformation','transition','release'],['resistance','stagnation','fear of change'],'Something has reached its true ending. Transformation becomes possible when the old form is allowed to close instead of being artificially preserved.','Change may be delayed by attachment, fear or repeated attempts to revive what has already run its course.',['sunrise','threshold','fallen crown']],
  ['14','Temperance','14_Temperance.png',['balance','integration','moderation','healing'],['excess','imbalance','poor integration'],'Combine rather than polarize. Progress comes through proportion, patience and the deliberate blending of different needs or methods.','Extremes are dominating, or elements that need integration are being kept artificially separate.',['two vessels','flowing water','path']],
  ['15','The Devil','15_The_Devil.png',['attachment','shadow','temptation','restriction'],['release','awareness','reclaiming power'],'Notice the attachment, fear or appetite that has acquired more influence than it deserves. Naming the pattern restores choice.','A limiting bond is becoming visible and therefore more possible to loosen. Awareness is the first act of release.',['chains','shadow figure','bondage']],
  ['16','The Tower','16_The_Tower.png',['upheaval','revelation','collapse','sudden change'],['avoided change','fear','private upheaval'],'A structure that cannot hold is breaking open. The disruption is real, but so is the clarity created when false stability disappears.','Necessary change may be postponed, internalized or managed quietly rather than through one dramatic rupture.',['lightning','falling crown','tower']],
  ['17','The Star','17_The_Star.png',['hope','renewal','inspiration','faith'],['discouragement','disconnection','loss of faith'],'After disruption, orientation returns. Hope here is not denial; it is the ability to imagine a future worth moving toward.','Discouragement or disconnection may make renewal difficult to trust, even when recovery has already begun.',['star field','water','open landscape']],
  ['18','The Moon','18_The_Moon.png',['intuition','uncertainty','illusion','subconscious'],['clarity','fear easing','confusion revealed'],'Not everything is visible yet. Move carefully through ambiguity, dreams, projections and instinct without pretending uncertainty has already resolved.','Fog may be lifting, or a fear previously shaping perception may finally be named and examined.',['moon','path','paired animals']],
  ['19','The Sun','19_The_Sun.png',['joy','clarity','vitality','success'],['temporary clouding','overexposure','delayed joy'],'Warmth, visibility and confidence return. What was hidden can now be seen more plainly, and energy is available for direct participation.','The positive potential remains, but confidence, timing or openness may be temporarily muted.',['sun','child','sunflowers']],
  ['20','Judgement','20_Judgement.png',['awakening','reckoning','renewal','calling'],['self-doubt','avoidance','unfinished reckoning'],'A clear assessment of the past creates the possibility of answering differently now. Listen for what you are being asked to rise into.','A necessary reckoning may be delayed by self-judgment, doubt or refusal to respond to what has become obvious.',['trumpet','rising figures','summons']],
  ['21','The World','21_The_World.png',['completion','integration','achievement','wholeness'],['unfinished business','delay','lack of closure'],'A cycle has integrated enough to be called complete. Recognize the achievement, absorb the lesson and prepare for the next beginning.','Closure is near but incomplete; one remaining task, insight or acknowledgment still needs attention.',['wreath','four guardians','dancing figure']]
].map(([number,name,file,upright,reversed,meaning,reversedMeaning,symbols]) => ({
  id:`major_${number}`, number, name, arcana:'Major', suit:null, image:`cards/Major_Arcana/${file}`, upright, reversed, meaning, reversedMeaning, symbols
}));

const ranks = [
  ['01','Ace'],['02','Two'],['03','Three'],['04','Four'],['05','Five'],['06','Six'],['07','Seven'],['08','Eight'],['09','Nine'],['10','Ten'],['11','Page'],['12','Knight'],['13','Queen'],['14','King']
];

const suits = {
  Cups: {
    element:'Water', domain:'emotion, relationships and intuition',
    cards:[
      [['new feelings','emotional opening','compassion'],['blocked emotion','emptiness','repressed feeling'],'An emotional beginning opens: receive what is trying to be felt rather than forcing an outcome.'],
      [['partnership','mutual attraction','connection'],['imbalance','separation','miscommunication'],'Two people or forces meet in genuine reciprocity. Mutuality matters more than intensity.'],
      [['friendship','celebration','community'],['overindulgence','gossip','social strain'],'Shared joy grows through friendship, collaboration and being witnessed by others.'],
      [['apathy','contemplation','reevaluation'],['renewed interest','restlessness','choosing again'],'Attention has withdrawn. The question is whether the pause is helping you recognize what actually matters.'],
      [['loss','grief','disappointment'],['acceptance','healing','moving forward'],'Loss deserves acknowledgment, but not everything has been lost. Grief and remaining possibility can coexist.'],
      [['nostalgia','memory','innocence'],['stuck in past','idealization','growing up'],'The past returns through memory, familiarity or tenderness. Receive the gift without idealizing what was.'],
      [['choices','imagination','illusion'],['clarity','decision','overwhelm easing'],'Possibility is abundant, but not every option is equally real. Imagination needs discernment.'],
      [['walking away','searching','disillusionment'],['avoidance','fear of leaving','returning'],'Something emotionally meaningful no longer satisfies. Leaving may be an act of honesty rather than rejection.'],
      [['contentment','satisfaction','wish fulfilled'],['dissatisfaction','excess','surface pleasure'],'Enjoyment and emotional satisfaction are available. Let pleasure be appreciated without turning it into entitlement.'],
      [['emotional fulfillment','family','belonging'],['disconnection','unrealistic harmony','family strain'],'Connection extends beyond a moment into a durable sense of belonging, shared joy and emotional safety.'],
      [['curiosity','sensitivity','creative message'],['emotional immaturity','escapism','blocked intuition'],'Stay receptive, playful and emotionally curious. A small feeling or message may contain more than it first appears.'],
      [['romance','idealism','following the heart'],['moodiness','fantasy','unreliable pursuit'],'Emotion moves into action. Follow what matters, but keep imagination connected to reality.'],
      [['empathy','intuition','emotional maturity'],['overgiving','insecurity','emotional absorption'],'Feel deeply without losing your center. Emotional intelligence includes boundaries as well as compassion.'],
      [['emotional balance','compassionate leadership','wisdom'],['emotional suppression','volatility','manipulation'],'Lead emotion without denying it. Calm authority comes from feeling fully while choosing deliberately.']
    ]
  },
  Swords: {
    element:'Air', domain:'thought, truth, conflict and communication',
    cards:[
      [['clarity','breakthrough','truth'],['confusion','misused intellect','mental block'],'A clear idea cuts through noise. Use precision to name what is true and what follows from it.'],
      [['stalemate','difficult choice','avoidance'],['indecision breaking','overload','truth emerging'],'A decision is being held in suspension. More avoidance will not create more information.'],
      [['heartbreak','sorrow','painful truth'],['healing','release','lingering hurt'],'Pain becomes unmistakable. Naming the wound is part of moving through it rather than around it.'],
      [['rest','recovery','contemplation'],['burnout','restlessness','returning too soon'],'The mind needs deliberate recovery. Stillness is productive when it restores capacity.'],
      [['conflict','winning at a cost','tension'],['reconciliation','resentment','making amends'],'Victory can become hollow when the method damages trust. Decide what is actually worth winning.'],
      [['transition','moving on','gradual recovery'],['resistance','unfinished baggage','stuck transition'],'Movement away from difficulty is underway, even if the destination is not yet joyful or clear.'],
      [['strategy','independence','secrecy'],['exposure','self-deception','poor strategy'],'Strategy matters, but cleverness without integrity creates its own vulnerability.'],
      [['restriction','self-limiting beliefs','powerlessness'],['release','new perspective','reclaiming agency'],'The trap is partly maintained by perception. Test which limits are real and which have become assumptions.'],
      [['anxiety','worry','night thoughts'],['relief','seeking help','fear easing'],'The mind is amplifying threat in private. Bring the fear into daylight, language and proportion.'],
      [['painful ending','collapse','finality'],['recovery','resisting an ending','survival'],'A cycle has reached an unmistakable end. The finality hurts, but it also prevents pretending.'],
      [['curiosity','alertness','new ideas'],['gossip','scattered thinking','defensiveness'],'Question, observe and learn quickly. Curiosity is strongest when it does not become suspicion.'],
      [['speed','ambition','directness'],['aggression','impulsiveness','poor timing'],'Thought becomes rapid action. Move decisively, but make sure speed is serving clarity rather than replacing it.'],
      [['discernment','independence','clear boundaries'],['bitterness','coldness','harsh judgment'],'Use intelligence cleanly. Clear boundaries and truthful language do not require cruelty.'],
      [['intellectual authority','truth','ethical judgment'],['misuse of power','rigidity','detachment'],'Lead with reason, standards and evidence. Good judgment remains accountable to both truth and consequence.']
    ]
  },
  Wands: {
    element:'Fire', domain:'energy, creativity, ambition and action',
    cards:[
      [['inspiration','new spark','potential'],['delay','lack of energy','false start'],'A live spark appears. Protect it long enough to discover whether it wants to become a real direction.'],
      [['planning','future vision','personal power'],['fear of unknown','poor planning','limited vision'],'You can see beyond the current boundary. Planning now determines whether possibility becomes movement.'],
      [['expansion','progress','foresight'],['delays','frustration','playing small'],'Initial effort is extending outward. Keep watching the horizon while adjusting to what the world actually returns.'],
      [['celebration','stability','homecoming'],['instability','private conflict','transition'],'A foundation is strong enough to celebrate. Mark the moment instead of rushing past it.'],
      [['competition','friction','creative tension'],['conflict avoidance','inner tension','resolution'],'Different energies are colliding. Friction can sharpen skill if it does not become pointless combat.'],
      [['recognition','victory','confidence'],['self-doubt','fall from grace','empty praise'],'Progress is visible and acknowledged. Receive recognition without making approval your only source of direction.'],
      [['defense','conviction','holding ground'],['exhaustion','giving up','overdefensiveness'],'You may need to defend a position you have earned. Choose the ground worth protecting.'],
      [['speed','movement','messages'],['delays','scattered energy','miscommunication'],'Events accelerate. Respond quickly, but keep the direction coherent as momentum builds.'],
      [['resilience','boundaries','persistence'],['fatigue','paranoia','rigidity'],'You are tired but experienced. Protect your remaining energy without assuming every approach is a threat.'],
      [['burden','responsibility','overload'],['delegation','release','avoidance of duty'],'Achievement has accumulated weight. Decide what is truly yours to carry and what can be redistributed.'],
      [['exploration','enthusiasm','new direction'],['lack of direction','impatience','insecurity'],'Follow curiosity and experiment. Early energy needs room to learn before it is forced into certainty.'],
      [['pursuit','bold action','adventure'],['recklessness','haste','frustration'],'Move toward what excites you, but give passion enough structure to avoid burning itself out.'],
      [['confidence','warmth','independence'],['jealousy','self-doubt','demanding attention'],'Occupy your space with warmth and self-trust. Confidence attracts more effectively than performance.'],
      [['vision','leadership','enterprise'],['impulsiveness','domination','unrealistic expectations'],'Turn creative fire into direction for others. Mature ambition creates momentum without consuming the people around it.']
    ]
  },
  Pentacles: {
    element:'Earth', domain:'work, resources, health and the material world',
    cards:[
      [['opportunity','prosperity','new resource'],['missed chance','scarcity thinking','poor planning'],'A practical opening appears. Ground it through attention, planning and consistent care.'],
      [['balance','adaptability','priorities'],['overcommitment','disorganization','imbalance'],'Several demands are moving at once. Flexibility works only when priorities remain visible.'],
      [['teamwork','craft','collaboration'],['poor teamwork','low standards','misalignment'],'Skill grows in relationship with standards, feedback and other people. Build something that can withstand inspection.'],
      [['security','control','conservation'],['greed','fear of loss','loosening control'],'Protecting resources is sensible until protection becomes possession. Security needs circulation as well as boundaries.'],
      [['hardship','exclusion','scarcity'],['recovery','support','improving conditions'],'Difficulty feels materially or socially isolating. Notice what help exists even if pride or fear makes it hard to approach.'],
      [['giving','receiving','fair exchange'],['strings attached','debt','unequal power'],'Resources move between people. Pay attention to fairness, dignity and the power created by who gives and who receives.'],
      [['patience','assessment','long-term investment'],['impatience','poor return','giving up too soon'],'Growth is underway but slow. Evaluate the return honestly before deciding whether to continue cultivating it.'],
      [['skill','practice','mastery'],['perfectionism','repetition without growth','low effort'],'Competence is built through repeated attention to detail. Practice should deepen skill, not just repeat motion.'],
      [['independence','self-sufficiency','earned comfort'],['overwork','dependence','status anxiety'],'Enjoy what disciplined effort has created. Independence is strongest when it includes pleasure, not only productivity.'],
      [['legacy','stability','long-term wealth'],['instability','family conflict','short-term thinking'],'Resources become structures that outlast the individual. Think in terms of continuity, stewardship and shared foundations.'],
      [['study','practical opportunity','steady beginning'],['procrastination','poor follow-through','lack of focus'],'Take the beginner role seriously. Curiosity becomes valuable when translated into disciplined practice.'],
      [['consistency','duty','methodical progress'],['stagnation','boredom','work without purpose'],'Slow, reliable effort can be powerful. The challenge is maintaining purpose inside repetition.'],
      [['nurturing resources','practical care','grounded abundance'],['self-neglect','smothering','financial insecurity'],'Care for people and resources in ways that are sustainable, embodied and realistic.'],
      [['stewardship','security','material leadership'],['greed','rigidity','status obsession'],'Manage resources with patience and long-range responsibility. Stability is a responsibility, not merely a possession.']
    ]
  }
};

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const filename = (num, rank, suit) => `${num}_${rank}_of_${suit}.png`;

const minor = Object.entries(suits).flatMap(([suit,def]) => ranks.map(([num,rank], index) => {
  const [upright,reversed,meaning] = def.cards[index];
  const displayRank = rank === 'Ace' ? 'Ace' : rank;
  return {
    id:`minor_${slug(suit)}_${num}`,
    number:num,
    name:`${displayRank} of ${suit}`,
    arcana:'Minor',
    suit,
    rank:displayRank,
    element:def.element,
    image:`cards/Minor_Arcana/${suit}/${filename(num,displayRank,suit)}`,
    upright,
    reversed,
    meaning,
    reversedMeaning:`The ${displayRank} of ${suit} reversed can point to ${reversed.join(', ')}. Rather than treating the energy as absent, notice where it may be blocked, internalized or expressed out of proportion.`,
    symbols:[def.element, def.domain, displayRank.toLowerCase()]
  };
}));

export const TAROT_CARDS = [...major, ...minor];
export const CARD_FILTERS = ['All','Major','Cups','Swords','Wands','Pentacles'];
