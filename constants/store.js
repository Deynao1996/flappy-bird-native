export const BIRD_WIDTH = 42
export const BIRD_HEIGHT = 34
export const PIPE_WIDTH = 52
export const PIPE_HEIGHT = 562
export const GROUND_HEIGHT = 150

export const ANIMATION_DURATION = 3000
export const COPTER_ANIMATION_DURATION = 2500

export const GRAVITY = 800
export const VELOCITY_ON_TAP = -400
export const PIPE_LEFT_EDGE = -100
export const COPTER_LEFT_EDGE = -150

export const PIPE_START_RANGE = -220
export const PIPE_END_RANGE = 200

export const SCORE_GRADIENT_VIBRANT = ['#ffffff', '#fffa50']
export const SCORE_GRADIENT_COOL = ['#ffffff', '#b2dffc']
export const OVERLAY_COLOR = '#000000ad'

export const COUNTDOWN_WIDTH = 24
export const COUNTDOWN_HEIGHT = 36

export const SCORE_Y = 150
export const SCORE_BOX_WIDTH = 64
export const SCORE_BOX_COLOR = '#00000036'
export const SCORE_BOX_RADIUS = 8

export const GIFT_SCORE_X = 8
export const GIFT_SCORE_Y = 5
export const GIFT_SCORE_WIDTH = 100
export const GIFT_SCORE_HEIGHT = 40

export const SPEER_WIDTH = 70
export const COPTER_HEIGHT = 48
export const COPTER_WIDTH = 150

//TODO Check difficulty steps range
export const APPEAR_GIFT_STEPS = [3, 8, 17, 21, 25]
export const GIFT_WISHES = [
  {
    title: 'День Рождения 🎂',
    description:
      'Ну что же. С Днем Рождения! Пожелать тебе здоровья? Было бы здорово, жаль, что абсолютного здоровья без болезней не будет.\n\nБолезни всегда существовали и будут существовать. Все живое, к сожалению, разрушается и подвергается болезням. Даже сейчас, пока ты это читаешь, в тебе происходит борьба с микробами и вырусами. И это нормально. Нельзя этого отрицать. Так есть.\n\nЧто могу пожелать - так это крепкого иммунитета, стрессоустойчивости, выдержки и стойкости, если вдруг приходят недуги. Пусть это тебя не угнетает. Любви и уважения к своему организму. Переносить все с улыбкой и терпением.'
  },
  {
    title: 'Стресс тебе не враг! 💪',
    description:
      'Пожелать тебе счастья? К сожалению...\n\nСама, я думаю, можешь наблюдать, что такое ощущение, что счастье и стресс - как будто две стороны медали, которые время от времени чередуются. Стрессовые ситуации так же необходимы как и ситуации, когда все идет хорошо. Только стрессовые ситации могут тебя укрепить, сделать сильнее и устойчивее  к неожиданным жизненным ситуациям.\n\nБудь сильной, сил тебе и внутренней настойчивости переживать все ситуации, которые будут на твоем пути. Будь смелой, чтоб нично не могло тебя сломать, подорвать твой настрой. Внешне - нежной и мягкой, внутри - крепкой и бесстрашной.'
  },
  {
    title: 'Что по поводу любви?  ❤️',
    description:
      'Неет, любовь, конечно, развенчивать я не стану.\n\nЧто без сомнений сразу можно пожелать - так это абсолютной любви! \n\nЯ не говорю сейчас про М + Ж любовь, там можно обсуждать бесконечно...\n\nВ первую очередь я имею ввиду любовь в формате Мать + Дочь, Отец + Сын, Брат + Сестра, к родителям, к лучшему другу. Про эту любовь. Вот она на самом деле достойна, и может очень многое, давать тебе невидомые силы, которых ты никогда не чувтсвовала. Она абсолютна. Она полностью принимает все твои недостатки, особенности, чтобы ты не сделала, где бы ты не ошиблась, эта любовь будет всегда, без потребностей. Тебя всегда поддержат, как и ты в свою очередь и будут с тобой до конца! На эту тему можно говорить долго, но не хватит высоты экрана...\n\nВот такой любви я тебе искренне без сомнений хочу пожелать. Чтобы она с тобой была всегда, ночью и днем, во сне и на яву.'
  },
  {
    title: 'Будь собой 🌞',
    description:
      'Ты - идеальна, неповторима в эту секунду, такая как ты есть!\n\nТы уникальна в своем роде, и такой как ты никогда здесь не было и никогда больше не будет, как и каждого из нас. Не забывай об этом, когда в стедующий раз будешь корить себя за что-то (если коришь), угнетать себя за то, что что-то у тебя не выходит или не получается (если угнетаешь), злиться та себя за что-то (если злишься).\n\nТы гениальна по-своему. Есть ли у тебя работа, должнось, дениги или еще что-то или ничего из этого нет, ты всегда будешь оставаться неповторимой. Со своими достоинствами, со своими недостатками (если они есть 😊)\n\nВ каждом есть талант. Я желаю его тебе раскрыть полностью, при этом не копируя других, раскрываться, оставаясь собой, именно такой какой ты есть. Любви  к себе, уважения за то, что ты именно такая.'
  },
  {
    title: 'Все буде добре! 😉',
    description:
      'Ну что же. Так как ты дошла до этого этапа, значит желать тебе настойчивости и целеустремленности смысла нет, так как эти качества значит у тебя уже есть, и мне не нужно еще тут языком лялякать про настойчивость и т.д. 😉\n\nЖелать тебе всего хорошего тоже смысла нет, потому что пожелаешь этого или нет, все равно у тебя и так будет все хорошо в конце концов. \n\nВещи могут казаться страшными, ужасными, веселыми, радостными, всякими разными, но все равно все развернется как должно будет, просто сейчас этого может быть не видно. Все встанет на свои места. Всему свое время, замедлить или ускорить ничего нельзя.\n\nТак что просто оставайся собой, делай то, чего не можешь не сделать, поступай и живи так, как считаешь нужным, люби, будь любимой, будь благодарна тому, какой ты есть на самом деле, люби себя, будь смелой, будь среди близких тебе людей, и все будет хорошо.\n\nСпасибо за внимание.\nС Днем Рождения! 🎉'
  }
]

export const TARGET_USER_ID = '663b0b0a3399a6bf829fdf66'
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
