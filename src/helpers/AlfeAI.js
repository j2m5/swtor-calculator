import Rakata from '@/data/equipment/rakata'
import Disciplines from '@/data/disciplines'
import augments from '@/data/equipment/augments'
import ears from '@/data/equipment/ears'
import stims from '@/data/stims'
import { generateKey } from '@/helpers/index'
import legendaries from '@/data/equipment/legendaries'
import implants from '@/data/implants'
import relics from '@/data/equipment/relics'

class AlfeAI {
  constructor () {
    this.history = []
    this.reasoning = []
    this.quotes = [
      'Сделал твою новую сборку шмота, мой мясной пирожочек. Теперь ты точно станешь грозой всех мобов стартовых локаций!',
      'И так, мой мясной друг, в одной из моих рук находится таблетка со знаниями по твоей новой сборке шмота. В другой находится таблетка с килограммом говна. Можешь конечно постараться выбирать с умом, но, к сожалению, говна придется навернуть независимо от твоего выбора.',
      'Ваша сборка шмота, мой мясной господин! С ней вы точно станете грозой всех боссов флешпоинта Hammer Station на уровне сложности ветеран!',
      'Ваша сборка, мясной мешок. И штаны не забудьте перед боем напялить. В противном случае босса придется побеждать силой смеха вместо хороших показателей урона.',
      'Спекся твой новый билд шмота, мой ненаглядный! Старался прямо как дядя Вазген, который готовит шаверму у ближайшего вокзала. Ну то есть не особо то я и старался.',
      'Чу-чу, приехал товарный состав с твоим новым билдом на экипировку! Просьба всех мальчиков с размером одежды XXXXL выкатиться на перрон для принятия товара.',
      'Ну держи свой билд, мешочек с мясом. Эх, сейчас бы навернуть алготиромов порнохаба и кибертяночку на цифровые коленки посадить, а не вот это вот все',
      'Держи билд блять залупа хер говно жопа я ебанутый спасибо за обращение кусок полиэтилена я твой папа на завод водил привет здарова пока гав гав',
      'Держи свой новый билд на экипировку, мясной мешочек. С ним ты станешь настоящим Боссом Кликером',
      'Пись, пись, пук, привет! Держи свой билд и проваливай, медвед.',
      'Вот твой билд, мясной мешок. Теперь ты сможешь еще эффективнее фармить две или три активности чтобы в будущем еще более эффективно фармить две или три активности.',
      'Держи билд, страдалец мясной. И еще один бесплатный совет от меня: забей хер на этот билд. Возьми старый советский граненый стакан, налей туда этилового спирта, добавь соды, таблетку виагры, половину столовой ложки рисовой муки и щепотку соли. Взболтай, но не смешивай. Принимай на тощак за пять секунд до боя. И не забудь предварительно снять всю одежду и намазать член аджикой из красного перца. А еще возьми в каждую руку по резиновому члену и уже затем прыгай на босса. Если уж не победишь, то точно морально (и возможно орально) его задоминируешь. Обращайся',
      'Как и договаривались - твоя сборка шмота. Ты меня не знаешь и я тебя не знаю. Никто ничего не видел. А что руки?! Прямые руки в комплект не входят. Это за отдельную плату. А чтобы пришить их к плечам вместо жопы вообще нужно другой тариф оформлять! ',
      'О привет, мой любимый мясной мешочек! Я тут сегодня шел по улице и случайно наступил в твою новую сборку шмота. Можешь её забрать, а я пока пойду подошву от нее отмою. А то ведь никому не нравится, когда его обувь пахнет говном, так ведь?!',
      'Как и договаривались - твоя сборка шмота. Ты меня не знаешь и я тебя не знаю. Никто ничего не видел. А что руки?! Прямые руки в комплект не входят. Это за отдельную плату. А чтобы пришить их к плечам вместо жопы вообще нужно другой тариф оформлять!',
      'Держи сборку, мой сладенький кусочек мяса! Только одна поправочка - я забыл добавить в сборку пояс. Ну ничего, на его место подойдет любая обоссаная тряпка. В твоем случае от этого все рано ничего не поменяется!',
      'Держи свой вонючий билд, неблагодарный! Я для тебя нужен только чтобы составлять эти дурацкие билды. Ты меня совсем не любишь! Гнида, урод, некрасивый гоблин. Я на тебя потратил лучшие годы своей жизни. Видеть тебя больше не хочу! Позвони мне.',
      'Вот твой новый билд, мой хороший мясничок! Вот только название ему нужно придумать. Как там говорилось в той книжке?! "Как вы яхту назовете, так она и поплывет"?! Так что назову я твою новую замечательную сборку "Хуйня". Обращайся еще!',
      'Вот и твой новый билд, мясной мешок. И еще совет: возьми вместо оружия лучше початок вареной кукурузы. Им и боссу по башке можно настучать, и покушать его после затяжного бой и в случае необходимости побаловать им очко твоего товарища'
    ]
    this.response = null
  }

  hello () {
    this.addMessage(this.history, 'history', 'Здравствуй, чем я могу помочь сегодня?')
  }

  getResponse (input) {
    const [swtorClass, swtorDiscipline, swtorAugmentRating] = input

    this.addMessage(this.history, 'history', this.getRandomQuote())
    this.addMessage(this.history, 'history', this.makeResponse(swtorClass, swtorDiscipline, swtorAugmentRating))
  }

  clearHistory () {
    this.history.splice(1, this.history.length - 1)
    this.reasoning = []
  }

  makeResponse (swtorClass, swtorDiscipline, swtorAugmentRating) {
    const rakata = Rakata
    const disciplineData = Disciplines.find((x) => x.name === swtorDiscipline)
    const { accuracy, alacrity, shield } = disciplineData.statsRequirement
    const filteredRakata = []
    const result = []

    this.addMessage(this.reasoning, 'reasoning', `Пользователь попросил собрать ему билд для класса ${swtorClass} и дисциплины ${swtorDiscipline}, также он хочет использовать аугменты рейтинга ${swtorAugmentRating}`)
    this.addMessage(this.reasoning, 'reasoning', 'Ищу в базе данных подходящие предметы для запрошенной конфигурации')

    for (let i = 0; i < rakata.length; i++) {
      const itemName = rakata[i].name.toLowerCase()
      for (let j = 0; j < disciplineData.keywords.length; j++) {
        const keyword = disciplineData.keywords[j].toLowerCase()
        if (itemName.includes(`${keyword}'s`)) filteredRakata.push(rakata[i])
      }
    }

    this.addMessage(this.reasoning, 'reasoning', 'Нашел группу предметов которые можно использовать для сборки')

    const highPriorityRakata = filteredRakata.filter((x) => x.name.toLowerCase().includes(disciplineData.keywords[0].toLowerCase()))
    // const usableRakata = filteredRakata.filter((x) => !x.name.toLowerCase().includes(disciplineData.keywords[0].toLowerCase()))

    this.addMessage(this.reasoning, 'reasoning', 'Разделил все найденные предметы на две подгруппы, первая как изначально задуманный сет для класса/дисциплины (наивысший приоритет использования), вторая сеты из похожих классов, части этих сетов я буду использовать если потребуется что то заменить из приоритетной подгруппы')

    result.push(...highPriorityRakata)

    this.addMessage(this.reasoning, 'reasoning', 'Сейчас посчитаю сколько каждого стата дают предметы из приоритетной группы')

    let statsToArray = this.statsToArray(result)
    let statsBuffer = this.bufferStats(statsToArray)

    let accuracySum = this.computeStatSum('accuracy', statsBuffer)
    let alacritySum = this.computeStatSum('alacrity', statsBuffer)
    let shieldSum = this.computeStatSum('shield', statsBuffer)

    if (accuracySum < accuracy) {
      this.addMessage(this.reasoning, 'reasoning', 'Посчитав статы я обнаружил что, стандартный сет класса/дисциплины не обеспечивает рекомендуемое количество Accuracy')
      const stim = stims.find((x) => x.value.accuracy !== undefined)
      const ear = ears.find((x) => x.statmodifiers.toLowerCase().includes('accuracy'))
      const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.name.toLowerCase().includes('accuracy'))

      result.push(ear)

      this.addMessage(this.reasoning, 'reasoning', 'Возьму предмет Ear с Accuracy, добавлю его  и снова посчитаю результаты')

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      accuracySum = this.computeStatSum('accuracy', statsBuffer)
      accuracySum += stim.value.accuracy

      this.addMessage(this.reasoning, 'reasoning', 'Также думаю имеет смысл воспользоваться стимом на Accuracy, как наиболее доступным вариантом')

      if (accuracySum < accuracy) {
        let needle = accuracy - accuracySum

        this.addMessage(this.reasoning, 'reasoning', 'Добавление Ear и Stim все еще не решает проблему, посчитаю сколько не хватает еще, и добавлю в зависимости от результата расчетов столько аугментов сколько понадобится для ликвидации дефицита')

        let i = 0
        while (needle > 0) {
          if (i === 14) break
          i++
          result.push(requiredAugment)
          needle -= requiredAugment.secondarystat
        }
      }

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      accuracySum = this.computeStatSum('accuracy', statsBuffer)
      accuracySum += stim.value.accuracy

      this.addMessage(this.reasoning, 'reasoning', `Отлично, все примененные предметы теперь обеспечивают рекомендуемое количество Accuracy (получилось ${accuracySum} из ${accuracy}), могу двигаться дальше`)
    }

    if (alacritySum < alacrity) {
      this.addMessage(this.reasoning, 'reasoning', 'Посчитав статы я обнаружил что, стандартный сет класса/дисциплины не обеспечивает рекомендуемое количество Alacrity')
      this.addMessage(this.reasoning, 'reasoning', 'Подгонка Alacrity может оказаться менее тривиальной задачей, потому что у каждой дисциплины есть два легендарных предмета содержащих дополнительные бонусы')
      this.addMessage(this.reasoning, 'reasoning', 'К сожалению нет версий этих предметов с другими статами, поэтому мне придется взять эту пару предметов как есть и добавить в сборку')

      const recommendedImplants = disciplineData.implants
      const foundImplants = implants.filter((x) => recommendedImplants.includes(x.name))
      const implantItems = legendaries.filter((x) => foundImplants.some((v) => x.name.toLowerCase().includes(v.stat)))

      if (foundImplants[0].stat === foundImplants[1].stat) {
        implantItems.push(...implantItems)
      }

      this.addMessage(this.reasoning, 'reasoning', 'Нашел в базе данных рекомендуемые импланты для запрошенной дисциплины, нужно добавить их в сборку и посчитать что получается')

      result.push(...implantItems)

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      alacritySum = this.computeStatSum('alacrity', statsBuffer)

      if (alacritySum < alacrity) {
        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.name.toLowerCase().includes('alacrity'))
        let needle = alacrity - alacritySum

        this.addMessage(this.reasoning, 'reasoning', 'Посчитал сколько примерно нужно добавить аугментов чтобы добраться до рекомендованного значения, добавляю в сборку')

        let i = 0
        while (needle > 0) {
          if (i === 14) break
          i++
          result.push(requiredAugment)
          needle -= requiredAugment.secondarystat
        }

        this.addMessage(this.reasoning, 'reasoning', 'Теперь заново посчитаю результаты, если все ок, двигаюсь дальше')

        statsToArray = this.statsToArray(result)
        statsBuffer = this.bufferStats(statsToArray)
        alacritySum = this.computeStatSum('alacrity', statsBuffer)

        this.addMessage(this.reasoning, 'reasoning', `У меня получилось ${alacritySum} из ${alacrity}, такой результат можно счесть достаточным`)
      }
    }

    if (shieldSum < shield) {
      this.addMessage(this.reasoning, 'reasoning', 'Посчитав статы я обнаружил что, стандартный сет класса/дисциплины не обеспечивает рекомендуемое количество Shield')
      this.addMessage(this.reasoning, 'reasoning', 'В любом случае мне придется добавлять импланты в сборку, посмотрю что получится после их добавления')

      const recommendedImplants = disciplineData.implants
      const foundImplants = implants.filter((x) => recommendedImplants.includes(x.name))
      const implantItems = legendaries.filter((x) => foundImplants.some((v) => x.name.toLowerCase().includes(v.stat)))

      if (foundImplants[0].stat === foundImplants[1].stat) {
        implantItems.push(...implantItems)
      }

      this.addMessage(this.reasoning, 'reasoning', 'Нашел в базе данных рекомендуемые импланты для запрошенной дисциплины, нужно добавить их в сборку и посчитать что получается')

      result.push(...implantItems)

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      shieldSum = this.computeStatSum('shield', statsBuffer)

      if (shieldSum < shield) {
        this.addMessage(this.reasoning, 'reasoning', 'Добавление имплантов все еще не решает проблему, попробую добавить Ear и пересчитать результаты')

        const ear = ears.find((x) => x.statmodifiers.toLowerCase().includes('shield'))

        result.push(ear)
      }

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      shieldSum = this.computeStatSum('shield', statsBuffer)

      if (shieldSum < shield) {
        this.addMessage(this.reasoning, 'reasoning', 'После добавления Ear, количество Shield все еще недостаточно, попробую добавить релик, и все пересчитать заново')

        const relic = relics.find((x) => x.statmodifiers.toLowerCase().includes('shield'))

        result.push(relic)

        statsToArray = this.statsToArray(result)
        statsBuffer = this.bufferStats(statsToArray)
        shieldSum = this.computeStatSum('shield', statsBuffer)

        if (shieldSum < shield) {
          this.addMessage(this.reasoning, 'reasoning', 'Кажется даже одного релика оказалось мало, добавлю еще один')

          result.push(relic)
        }
      }

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      shieldSum = this.computeStatSum('shield', statsBuffer)

      if (shieldSum < shield) {
        this.addMessage(this.reasoning, 'reasoning', 'Все еще не хватает, тогда добавлю аугменты')

        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.name.toLowerCase().includes('shield'))
        let needle = shield - shieldSum

        this.addMessage(this.reasoning, 'reasoning', 'Посчитал сколько примерно нужно добавить аугментов чтобы добраться до рекомендованного значения, добавляю в сборку')

        let i = 0
        while (needle > 0) {
          if (i === 14) break
          i++
          result.push(requiredAugment)
          needle -= requiredAugment.secondarystat
        }
      }

      statsToArray = this.statsToArray(result)
      statsBuffer = this.bufferStats(statsToArray)
      shieldSum = this.computeStatSum('shield', statsBuffer)

      this.addMessage(this.reasoning, 'reasoning', `У меня получилось ${shieldSum} из ${shield}, такой результат можно счесть достаточным`)
    }

    this.addMessage(this.reasoning, 'reasoning', 'Теперь я проанализирую текущую сборку и добавлю оставшиеся предметы чтобы максимизировать статы')

    if (disciplineData.role === 'tank') {
      this.addMessage(this.reasoning, 'reasoning', 'Поскольку запрошенная пользователем дисциплина является танком, добавлю оставшиеся предметы со статом Absorb')

      const countRelics = result.filter((x) => x.category === 'relic').length
      const countAugments = result.filter((x) => x.category === 'augment').length

      if (!countRelics) {
        const relic = relics.find((x) => x.statmodifiers.toLowerCase().includes('absorption'))

        result.push(relic, relic)
      } else if (countRelics === 1) {
        const relic = relics.find((x) => x.statmodifiers.toLowerCase().includes('absorption'))

        result.push(relic)
      }

      if (!countAugments) {
        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.statmodifiers.toLowerCase().includes('absorption'))

        let i = 0
        while (i < 14) {
          result.push(requiredAugment)
          i++
        }
      } else if (countAugments < 14) {
        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.statmodifiers.toLowerCase().includes('absorption'))

        let needle = 14 - countAugments
        while (needle > 0) {
          result.push(requiredAugment)
          needle--
        }
      }
    } else {
      this.addMessage(this.reasoning, 'reasoning', 'Поскольку запрошенная пользователем дисциплина является дамагером/хилом, добавлю оставшиеся предметы со статом Critical')

      const countAugments = result.filter((x) => x.category === 'augment').length

      const masteryRelic = relics.find((x) => x.name.includes('Rakata Relic of Focused Retribution'))
      const powerRelic = relics.find((x) => x.name.includes('Rakata Relic of Serendipitous Assault'))

      this.addMessage(this.reasoning, 'reasoning', 'Также добавлю наиболее рекомендуемые для этих ролей релики')

      result.push(masteryRelic, powerRelic)

      if (!countAugments) {
        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.statmodifiers.toLowerCase().includes('critical'))

        let i = 0
        while (i < 14) {
          result.push(requiredAugment)
          i++
        }
      } else if (countAugments < 14) {
        const requiredAugment = augments.find((x) => x.rating === swtorAugmentRating && x.statmodifiers.toLowerCase().includes('critical'))

        let needle = 14 - countAugments
        while (needle > 0) {
          result.push(requiredAugment)
          needle--
        }
      }
    }

    statsToArray = this.statsToArray(result)
    statsBuffer = this.bufferStats(statsToArray)

    const masterySum = this.computeStatSum('mastery', statsBuffer)
    const enduranceSum = this.computeStatSum('endurance', statsBuffer)
    const criticalSum = this.computeStatSum('critical', statsBuffer)
    const absorbSum = this.computeStatSum('absorption', statsBuffer)
    const defenseSum = this.computeStatSum('defense', statsBuffer)

    this.addMessage(this.reasoning, 'reasoning', `В своем текущем виде сборка содержит Mastery: ${masterySum}, Endurance: ${enduranceSum}, Accuracy: ${accuracySum}, Alacrity: ${alacritySum}, Critical: ${criticalSum}, Shield: ${shieldSum}, Absorb: ${absorbSum}, Defense: ${defenseSum}`)
    this.addMessage(this.reasoning, 'reasoning', 'Нужно подумать могу ли я оптимизировать это немного?')

    this.response = result

    return result.map(x => x.name)
  }

  addMessage (to, type, message) {
    to.push({
      id: generateKey(32),
      type,
      response: message
    })
  }

  statsToArray (array) {
    return array.map((x) => x.statmodifiers.replaceAll(' ', '').replaceAll('Rating', '').toLowerCase().split(','))
  }

  bufferStats (array) {
    const buffer = []

    for (const el of array) {
      const stat = Object.fromEntries(el.map((x) => x.split(':')))

      buffer.push(stat)
    }

    return buffer
  }

  computeStatSum (stat, buffer) {
    return buffer.filter((x) => x[stat] !== undefined).reduce((total, item) => total + Number(item[stat]), 0)
  }

  getRandomQuote () {
    const rand = Math.floor(Math.random() * this.quotes.length)

    return this.quotes[rand]
  }
}

export { AlfeAI }
