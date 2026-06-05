import { Question } from "./types";

export const QUESTION_BANK: Question[] = [
  {
    id: 1,
    stem: "Despite his best efforts to conceal his anger ......",
    options: [
      { key: "A", text: "we could detect that he was very happy" },
      { key: "B", text: "he failed to give us an impression of his agony" },
      { key: "C", text: "he succeeded in camouflaging his emotions" },
      { key: "D", text: "he could succeed in doing it easily" },
      { key: "E", text: "people came to know that he was annoyed" }
    ],
    correctKey: "E",
    explanation: "The word 'Despite' indicates a contrast. Although he tried hard to conceal (hide) his anger, he was unsuccessful, and thus 'people came to know that he was annoyed'."
  },
  {
    id: 2,
    stem: "Even if it rains I shall come means ......",
    options: [
      { key: "A", text: "if I come it will not rain" },
      { key: "B", text: "if it rains I shall not come" },
      { key: "C", text: "I will certainly come whether it rains or not" },
      { key: "D", text: "whenever there is rain I shall come" },
      { key: "E", text: "I am less likely to come if it rains" }
    ],
    correctKey: "C",
    explanation: "'Even if it rains I shall come' implies that weather conditions are immaterial to my arrival. It means that I will certainly come, regardless of whether it rains or not."
  },
  {
    id: 3,
    stem: "His appearance is unsmiling but ......",
    options: [
      { key: "A", text: "his heart is full of compassion for others" },
      { key: "B", text: "he looks very serious on most occasions" },
      { key: "C", text: "people are afraid of him" },
      { key: "D", text: "he is uncompromising on matters of task performance" },
      { key: "E", text: "he is full of jealousy towards his colleagues" }
    ],
    correctKey: "A",
    explanation: "The conjunction 'but' introduces a contrasting positive element to counter the negative quality of being 'unsmiling'. This makes 'his heart is full of compassion for others' the most meaningful contrast."
  },
  {
    id: 4,
    stem: "She never visits any zoo because she is a strong opponent of the idea of ......",
    options: [
      { key: "A", text: "setting the animals free into forest" },
      { key: "B", text: "feeding the animals while others are watching" },
      { key: "C", text: "watching the animals in their natural abode" },
      { key: "D", text: "going out of the house on a holiday" },
      { key: "E", text: "holding the animals in captivity for our joy" }
    ],
    correctKey: "E",
    explanation: "Zoos hold animals in cages for public entertainment. If she never visits zoos because she strongly opposes an idea, that idea must be 'holding the animals in captivity for our joy'."
  },
  {
    id: 5,
    stem: "I felt somewhat more relaxed ......",
    options: [
      { key: "A", text: "but tense as compared to earlier" },
      { key: "B", text: "and tense as compared to earlier" },
      { key: "C", text: "as there was already no tension at all" },
      { key: "D", text: "and tension-free as compared to earlier" },
      { key: "E", text: "because the worry had already captured my mind" }
    ],
    correctKey: "D",
    explanation: "Feeling 'somewhat more relaxed' is a positive state of relief. This is logically augmented by saying she/he felt 'and tension-free as compared to earlier'."
  },
  {
    id: 6,
    stem: "It is not easy to remain tranquil when those around you ......",
    options: [
      { key: "A", text: "behave in a socially acceptable manner" },
      { key: "B", text: "exhibit pleasant mannerism" },
      { key: "C", text: "are losing their heads" },
      { key: "D", text: "agree to whatever you say" },
      { key: "E", text: "exhibit generous and magnanimous gestures" }
    ],
    correctKey: "C",
    explanation: "'Tranquil' means calm and peaceful. It is difficult to stay calm when people around you are panic-stricken, angry, or acting irrationally, described idiomatically as 'losing their heads'."
  },
  {
    id: 7,
    stem: "\"The food in this hotel is no match to what we were forced to eat at late hours in Hotel Kohinoor\" means ......",
    options: [
      { key: "A", text: "The food in this hotel is quite good compared to what we ate at Kohinoor" },
      { key: "B", text: "Hotel Kohinoor served us better quality food than what we get here" },
      { key: "C", text: "Both hotels have maintained good quality of food" },
      { key: "D", text: "Both hotels serve poor quality of food" },
      { key: "E", text: "It is better to eat food than remain hungry" }
    ],
    correctKey: "B",
    explanation: "Saying 'food in this hotel is no match' to Kohinoor implies that Kohinoor's food is of a superior quality that this hotel cannot equal. Thus, Hotel Kohinoor served better food."
  },
  {
    id: 8,
    stem: "Although initial investigations pointed towards him ......",
    options: [
      { key: "A", text: "the preceding events corroborated his involvement in the crime" },
      { key: "B", text: "the additional information confirmed his guilt" },
      { key: "C", text: "the subsequent events established that he was guilty" },
      { key: "D", text: "the subsequent events proved that he was innocent" },
      { key: "E", text: "he gave an open confession of his crime" }
    ],
    correctKey: "D",
    explanation: "The word 'Although' signals a reversal of expectations. Since initial investigations pointed to him being guilty, the contrasting resolution is that subsequent events cleared his name and proved him innocent."
  },
  {
    id: 9,
    stem: "The weather outside was extremely pleasant and hence we decided to ......",
    options: [
      { key: "A", text: "utilise our time in watching the television" },
      { key: "B", text: "refrain from going out for a morning walk" },
      { key: "C", text: "enjoy a morning ride in the open" },
      { key: "D", text: "employ this rare opportunity for writing letters" },
      { key: "E", text: "remain seated in our rooms in the bungalow" }
    ],
    correctKey: "C",
    explanation: "Pleasant weather is a natural motivator to go outside. Enjoying a 'morning ride in the open' is the most logical activity to choose under such weather conditions."
  },
  {
    id: 10,
    stem: "\"It is an uphill task but you will have to do it\" means ......",
    options: [
      { key: "A", text: "The work is above the hill and you will have to do it" },
      { key: "B", text: "It is a very easy task but you must do it" },
      { key: "C", text: "It is a very difficult task but you have to do it" },
      { key: "D", text: "This work is not reserved for you but you will have to do it" },
      { key: "E", text: "It is almost impossible for others but you can do it" }
    ],
    correctKey: "C",
    explanation: "An 'uphill task' is a well-known idiomatic expression meaning an extremely arduous or difficult undertaking requiring heavy, sustained effort."
  },
  {
    id: 11,
    stem: "\"You are thinking very highly about Ravi but he is not so\" means ......",
    options: [
      { key: "A", text: "Ravi is as good as you think about him" },
      { key: "B", text: "You have a good opinion about Ravi but he is not as good as you think" },
      { key: "C", text: "Your view about Ravi is philosophical, keep it up" },
      { key: "D", text: "Ravi is much better than what you think of him" },
      { key: "E", text: "You have a good opinion about Ravi but he does not have a good opinion about you" }
    ],
    correctKey: "B",
    explanation: "The sentence directly states that you hold a premium, lofty opinion of Ravi ('thinking very highly'), but his actual character or capability does not live up to that image ('he is not so')."
  },
  {
    id: 12,
    stem: "\"Anand struck up a friendship with Mahesh in just 2 days\" means ......",
    options: [
      { key: "A", text: "Anand's friendship with Mahesh came to an end recently" },
      { key: "B", text: "Anand found out the other friends of Mahesh" },
      { key: "C", text: "Anand fixed a deal with Mahesh in 2 days" },
      { key: "D", text: "Anand's friendship with Mahesh lasted for 2 years" },
      { key: "E", text: "Anand became a friend of Mahesh in less than 2 days" }
    ],
    correctKey: "E",
    explanation: "To 'strike up a friendship' means to start a friendship, and doing it in 'just 2 days' indicates the rapid speed of their bonding, i.e., becoming friends quickly."
  },
  {
    id: 13,
    stem: "Although he is reputed for making very candid statements ......",
    options: [
      { key: "A", text: "his today's speech was not fairly audible" },
      { key: "B", text: "his promises had always been realistic" },
      { key: "C", text: "his speech was very interesting" },
      { key: "D", text: "people follow whatever he instructs to them" },
      { key: "E", text: "his statements today were very ambiguous" }
    ],
    correctKey: "E",
    explanation: "'Candid' means direct, honest, frank, and clear. Since 'Although' highlights a contradiction, the correct answer must contrast candidness with ambiguity or evasiveness."
  },
  {
    id: 14,
    stem: "The manager would like you to help Dhiraj, means ......",
    options: [
      { key: "A", text: "the manager would like you if you help Dhiraj" },
      { key: "B", text: "the manager desires you to help Dhiraj" },
      { key: "C", text: "the manager likes you because you help Dhiraj" },
      { key: "D", text: "Dhiraj expects the manager to tell you to help him" },
      { key: "E", text: "it will be a help to the manager if you like Dhiraj" }
    ],
    correctKey: "B",
    explanation: "To say 'X would like you to do Y' represents a polite way of communicating X's desire or request for you to execute Y. Thus, the manager desires that you help Dhiraj."
  },
  {
    id: 15,
    stem: "Owing to the acute power shortage, the people of our locality have decided to ......",
    options: [
      { key: "A", text: "dispense with other non-conventional energy sources" },
      { key: "B", text: "resort to abundant use of electricity for illumination" },
      { key: "C", text: "off-switch the electrical appliances while not in use" },
      { key: "D", text: "explore other avenues for utilising the excess power" },
      { key: "E", text: "resort to use of electricity only when it is inevitable" }
    ],
    correctKey: "E",
    explanation: "Under severe power shortages (acute shortage), the community must practice extreme energy conservation. Using electricity only when absolutely inevitable (vital/necessary) is the most logical community resolution."
  },
  {
    id: 16,
    stem: "He has no money now ......",
    options: [
      { key: "A", text: "although he was very poor once" },
      { key: "B", text: "as he has given up all his wealth" },
      { key: "C", text: "because he was very rich once" },
      { key: "D", text: "because he has received a huge donation" },
      { key: "E", text: "because he was very greedy about wealth" }
    ],
    correctKey: "B",
    explanation: "The statement 'He has no money now' needs a cause. Option B provides a perfect causal response: he is penniless because he has surrendered or given away all of his assets."
  },
  {
    id: 17,
    stem: "He is so lazy that he ......",
    options: [
      { key: "A", text: "cannot depend on others for getting his work done" },
      { key: "B", text: "cannot delay the schedule of completing the work" },
      { key: "C", text: "can seldom complete his work on time" },
      { key: "D", text: "dislikes to postpone the work that he undertakes to do" },
      { key: "E", text: "always helps others to complete their work" }
    ],
    correctKey: "C",
    explanation: "The physical construction 'so [adjective] that [consequence]' relates a character trait directly to its matching consequence. Being lazy causes him to rarely ('seldom') compile or complete work on schedule."
  },
  {
    id: 18,
    stem: "Dinesh is as stupid as he is lazy means ......",
    options: [
      { key: "A", text: "Dinesh is stupid because he is lazy" },
      { key: "B", text: "Dinesh is lazy because he is stupid" },
      { key: "C", text: "Dinesh is either stupid or lazy" },
      { key: "D", text: "Dinesh is hardly stupid but he is lazy" },
      { key: "E", text: "Dinesh is equally stupid and lazy" }
    ],
    correctKey: "E",
    explanation: "The comparative formula 'as [X] as [Y]' when applied to traits asserts that the subject possesses both attributes to an equal level or extent."
  },
  {
    id: 19,
    stem: "Practically, very little work could be completed in the last week as it was ......",
    options: [
      { key: "A", text: "full of working days" },
      { key: "B", text: "a very hectic week" },
      { key: "C", text: "full of holidays" },
      { key: "D", text: "a very busy week" },
      { key: "E", text: "loaded with work" }
    ],
    correctKey: "C",
    explanation: "If very little work was completed, it indicates there was no time to work. A week being 'full of holidays' explains why they did not accomplish any assignments."
  },
  {
    id: 20,
    stem: "Because he believes in democratic principles, he always ......",
    options: [
      { key: "A", text: "decides all the matters himself" },
      { key: "B", text: "listens to others' views and enforces his own" },
      { key: "C", text: "shows respect to others' opinions if they match his own" },
      { key: "D", text: "reconciles with the majority views and gives us his own" },
      { key: "E", text: "imposes his own views on others" }
    ],
    correctKey: "D",
    explanation: "Democratic philosophies represent listening to the crowd and compromising to fit public desire. Reconciling his individual perspective with the wishes of the majority embodies this principle perfectly."
  },
  {
    id: 21,
    stem: "With great efforts his son succeeded in convincing him not to donate his entire wealth to an orphanage ......",
    options: [
      { key: "A", text: "and lead the life of a wealthy merchant" },
      { key: "B", text: "but to a home for the forsaken children" },
      { key: "C", text: "and make an orphan of himself" },
      { key: "D", text: "as the orphanage needed a lot of donations" },
      { key: "E", text: "as the orphanage had been set up by him" }
    ],
    correctKey: "C",
    explanation: "Donating his entire fortune would leave his family penniless. By convincing him not to donate all his assets, the son protected his inheritance, preventing the father from 'making an orphan' (impoverishing) of the son."
  },
  {
    id: 22,
    stem: "The employer appeared to be in such an affable mood that Rohit ......",
    options: [
      { key: "A", text: "decided to ask for a raise in his salary" },
      { key: "B", text: "was scared to talk to him about his leave" },
      { key: "C", text: "felt very guilty for his inadvertent slip" },
      { key: "D", text: "promised him that he would not commit a mistake again" },
      { key: "E", text: "was pained to press his demand for a new flat." }
    ],
    correctKey: "A",
    explanation: "'Affable' means exceptionally warm, friendly, and easy to talk to. Seeing the boss in such high spirits, Rohit felt motivated to seize the golden moment and make a request for a raise."
  },
  {
    id: 23,
    stem: "He always stammers in public meetings, but his today's speech ......",
    options: [
      { key: "A", text: "was fairly audible to everyone present in the hall" },
      { key: "B", text: "was not received satisfactorily" },
      { key: "C", text: "could not be understood properly" },
      { key: "D", text: "was not liked by the audience" },
      { key: "E", text: "was free from that defect" }
    ],
    correctKey: "E",
    explanation: "The conjunction 'but' indicates an exception or contrast to his habitual pattern of stammering. This means his speech today was completely fluent, i.e., 'free from that defect'."
  },
  {
    id: 24,
    stem: "Even though it is a very large house, ......",
    options: [
      { key: "A", text: "there is a lot of space available in it for children" },
      { key: "B", text: "there is hardly any space available for children" },
      { key: "C", text: "there is no dearth of space for children" },
      { key: "D", text: "the servants take a long time to clean it" },
      { key: "E", text: "the municipal taxes on it are very happy" }
    ],
    correctKey: "B",
    explanation: "'Even though' signals that the outcome is opposite to what is expected. Usually, a large house has excess space; the contrast, therefore, is that there is 'hardly any space available' for the children."
  },
  {
    id: 25,
    stem: "It was an extremely pleasant surprise for the hutment-dweller when the Government officials told him that ......",
    options: [
      { key: "A", text: "he had to vacate the hutment which he had been unauthorizedly occupying" },
      { key: "B", text: "he had been gifted with a furnished apartment in a multi-storeyed building" },
      { key: "C", text: "he would be arrested for wrongfully encroaching on the pavement" },
      { key: "D", text: "they would not accede to his request" },
      { key: "E", text: "they had received the orders from the court to take possession of his belongings" }
    ],
    correctKey: "B",
    explanation: "Eviction, arrest, decline of proposal, or seizure are highly distressing, negative events. The only event that represents an 'extremely pleasant surprise' is being gifted a fully furnished apartment."
  },
  {
    id: 26,
    stem: "In order to help the company attain its goal of enhancing profit, all the employees ......",
    options: [
      { key: "A", text: "urged the management to grant paid leave" },
      { key: "B", text: "appealed to the management to implement new welfare schemes" },
      { key: "C", text: "voluntarily offered to work overtime with lucrative compensation" },
      { key: "D", text: "voluntarily offered to render additional services in lieu of nothing" },
      { key: "E", text: "decided to enhance production at the cost of quality of the product" }
    ],
    correctKey: "D",
    explanation: "To help enhance corporate profits, workers made a sacrifice. Offering work 'in lieu of nothing' (free or voluntary contribution) directly lowers operating costs, thereby maximizing the company's financial success."
  },
  {
    id: 27,
    stem: "\"Whatever Dev uttered was without rhyme or reason\" means ......",
    options: [
      { key: "A", text: "Dev could not recite any poem or speech" },
      { key: "B", text: "Dev said something which has no meaning, it was totally baseless" },
      { key: "C", text: "Dev was talking something which was beyond our experience" },
      { key: "D", text: "Dev spoke flatly without any emotion or reason" },
      { key: "E", text: "Dev did not refer to any poem to support his statements" }
    ],
    correctKey: "B",
    explanation: "The idiom 'without rhyme or reason' is applied to actions or statements that are completely illogical, baseless, or containing no coherent sense or justification."
  },
  {
    id: 28,
    stem: "He tames animals because he ......",
    options: [
      { key: "A", text: "is fond of them" },
      { key: "B", text: "hates them" },
      { key: "C", text: "is afraid of them" },
      { key: "D", text: "wants to set them free" },
      { key: "E", text: "seldom loves them" }
    ],
    correctKey: "A",
    explanation: "To 'tame' animals means to keep and nurture them as pets or helpers. A person typically undertakes this because they are exceptionally warm style, attached, or 'fond of them'."
  },
  {
    id: 29,
    stem: "Mahesh need not have purchased the bag, means ......",
    options: [
      { key: "A", text: "it was not necessary for Mahesh to purchase the bag but he has purchased it" },
      { key: "B", text: "it was necessary for Mahesh to purchase the bag and he has not purchased it" },
      { key: "C", text: "it was not necessary for Mahesh to purchase the bag and he has not purchased it" },
      { key: "D", text: "it was necessary for Mahesh to purchase the bag but he has not purchased it" },
      { key: "E", text: "Mahesh already has a bag but still he purchased another one" }
    ],
    correctKey: "A",
    explanation: "The phrase 'need not have [verb]' is used to describe an action that was carried out in the past but was actually unnecessary or superfluous."
  },
  {
    id: 30,
    stem: "In order to raise company's profit, the employees ......",
    options: [
      { key: "A", text: "demanded two additional increments" },
      { key: "B", text: "decided to go on paid holidays" },
      { key: "C", text: "requested the management to implement new welfare schemes" },
      { key: "D", text: "offered to work overtime without any compensation" },
      { key: "E", text: "decided to raise the cost of raw material" }
    ],
    correctKey: "D",
    explanation: "Working overtime without compensation is a selfless concession by employees to help lower corporate expenditures and directly lift profits."
  },
  {
    id: 31,
    stem: "The officer who had neglected to file his income tax returns had to ......",
    options: [
      { key: "A", text: "return the files" },
      { key: "B", text: "pay a fine" },
      { key: "C", text: "be rewarded" },
      { key: "D", text: "play mischief" },
      { key: "E", text: "give warning" }
    ],
    correctKey: "B",
    explanation: "Neglecting statutory legal obligations (like filing income tax returns) leads to legal penalties or a monetary fine. Thus, the officer 'had to pay a fine'."
  },
  {
    id: 32,
    stem: "Unless you work harder you will fail, means ......",
    options: [
      { key: "A", text: "if you fail you will work harder" },
      { key: "B", text: "you must at least plan well then you will not fail" },
      { key: "C", text: "hardly you will fail if you do not desire so" },
      { key: "D", text: "if you do not put more efforts, then you will fail" },
      { key: "E", text: "if you only work and work alone, you will fail" }
    ],
    correctKey: "D",
    explanation: "'Unless X, Y' means 'if not X, then Y'. So 'Unless you work harder you will fail' is equivalent to 'if you do not put more efforts (work harder), you will fail'."
  },
  {
    id: 33,
    stem: "His behaviour is so unpredictable that he ......",
    options: [
      { key: "A", text: "never depends upon others for getting his work done" },
      { key: "B", text: "is seldom trusted by others" },
      { key: "C", text: "always finds it difficult to keep his word" },
      { key: "D", text: "always insists on getting the work completed on time" },
      { key: "E", text: "seldom trusts others as far as the work schedule is concerned" }
    ],
    correctKey: "B",
    explanation: "If someone is highly 'unpredictable', you never know what they will do next or if they will keep commitments. Thus, other people find it hard to rely on him; he is 'seldom trusted by others'."
  }
];
