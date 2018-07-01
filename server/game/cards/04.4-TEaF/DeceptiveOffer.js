this.action({
      title: 'Increase a character\'s military and political skill or take an honor from your opponent',
      targets: {
        character: {
          cardType: 'character',
          controller: 'self',
          cardCondition: card => card.isparticipating()
        },
        select: {
          mode: 'select',
          dependsOn: 'character',
          player: 'opponent',
          choices: {
            'Allow your opponent\'s character to gain military and political skill': ability.actions.cardLastingEffect(() => ({
              target: context.targets.character,
              duration: 'untilEndOfConflict',
              effect: [
                ability.effects.modifyMilitarySkill(2),
                ability.effects.modifyPoliticalSkill(2)
              ]
            })),
            'Give your opponent 1 honor': ability.actions.takeHonor()
          }
        }
      }
    });
