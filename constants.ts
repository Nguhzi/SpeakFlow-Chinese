
import { UserLevel, Unit } from './types';

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'unit_1',
    title: 'Greetings & Introductions',
    outcome: 'I can introduce myself and greet others',
    level: UserLevel.BEGINNER,
    progress: 0,
    isLocked: false,
    items: [
      { id: 'item_1', chinese: '你好', pinyin: 'nǐ hǎo', english: 'Hello', type: 'phrase' },
      { id: 'item_2', chinese: '我叫...', pinyin: 'wǒ jiào...', english: 'My name is...', type: 'sentence' },
      { id: 'item_3', chinese: '很高兴认识你', pinyin: 'hěn gāoxìng rènshì nǐ', english: 'Nice to meet you', type: 'phrase' },
      { id: 'item_4', chinese: '你呢？', pinyin: 'nǐ ne?', english: 'And you?', type: 'phrase' },
    ]
  },
  {
    id: 'unit_2',
    title: 'Numbers & Time',
    outcome: 'I can count and tell the time',
    level: UserLevel.BEGINNER,
    progress: 0,
    isLocked: false,
    items: [
      { id: 'item_5', chinese: '一', pinyin: 'yī', english: 'One', type: 'word' },
      { id: 'item_6', chinese: '二', pinyin: 'èr', english: 'Two', type: 'word' },
      { id: 'item_7', chinese: '三', pinyin: 'sān', english: 'Three', type: 'word' },
      { id: 'item_8', chinese: '现在几点？', pinyin: 'xiànzài jǐ diǎn?', english: 'What time is it now?', type: 'sentence' },
    ]
  },
  {
    id: 'unit_3',
    title: 'Ordering Food',
    outcome: 'I can order a simple meal at a restaurant',
    level: UserLevel.INTERMEDIATE,
    progress: 0,
    isLocked: true,
    items: [
      { id: 'item_9', chinese: '我想点这个', pinyin: 'wǒ xiǎng diǎn zhège', english: 'I would like to order this', type: 'sentence' },
      { id: 'item_10', chinese: '菜单', pinyin: 'càidān', english: 'Menu', type: 'word' },
      { id: 'item_11', chinese: '买单', pinyin: 'mǎidān', english: 'The bill, please', type: 'phrase' },
    ]
  }
];

export const GOAL_OPTIONS = [
  { id: 'daily', label: 'Daily conversation', icon: '💬' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'work', label: 'Work/Study', icon: '💼' },
  { id: 'exploring', label: 'Just exploring', icon: '✨' },
];

export const EXPERIENCE_OPTIONS = [
  { id: 'never', label: 'Never', description: 'Total beginner' },
  { id: 'little', label: 'A little', description: 'Know some basics' },
  { id: 'consistently', label: 'Consistently', description: 'Can hold simple talks' },
];
