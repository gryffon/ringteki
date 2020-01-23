describe('Dragon Tattoo', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-kazue', 'doji-challenger', 'solemn-scholar', 'isawa-atsuko', 'togashi-mitsu'],
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'dragon-tattoo', 'dragon-tattoo', 'dragon-tattoo', 'mantra-of-fire', 'rising-stars-kata', 'benten-s-touch', 'a-fate-worse-than-death'],
                    conflictDiscard: ['defend-your-honor', 'hurricane-punch']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['way-of-the-scorpion', 'watch-commander']
                }
            });

            this.kazue = this.player1.findCardByName('togashi-kazue');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.dragonTattoo1 = this.player1.filterCardsByName('dragon-tattoo')[0];
            this.dragonTattoo2 = this.player1.filterCardsByName('dragon-tattoo')[1];
            this.dragonTattoo3 = this.player1.filterCardsByName('dragon-tattoo')[2];
            this.mantraOfFire = this.player1.findCardByName('mantra-of-fire');
            this.kata = this.player1.findCardByName('rising-stars-kata');
            this.dyh = this.player1.findCardByName('defend-your-honor');
            this.afwtd = this.player1.findCardByName('a-fate-worse-than-death');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.atsuko = this.player1.findCardByName('isawa-atsuko');
            this.bentens = this.player1.findCardByName('benten-s-touch');
            this.hurricanePunch = this.player1.findCardByName('hurricane-punch');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.scorpion2 = this.player2.findCardByName('way-of-the-scorpion');
            this.watchCommander = this.player2.findCardByName('watch-commander');

            this.player1.playAttachment(this.dragonTattoo1, this.kazue);
            this.player2.pass();
            this.player1.playAttachment(this.dragonTattoo2, this.challenger);
        });

        it('should add tattooed trait', function() {
            expect(this.challenger.hasTrait('tattooed')).toBe(true);
        });

        it('should only attach to characters you control', function() {
            this.player2.pass();
            this.player1.clickCard(this.dragonTattoo3);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
        });


        it('should react after you target your own character with an event', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo2);

            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kuwanan);

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.scorpion.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 plays Way of the Scorpion to dishonor Togashi Kazue');
            expect(this.getChatLogs(5)).toContain('player1 uses Dragon Tattoo to play Way of the Scorpion');
            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Scorpion to dishonor Doji Kuwanan');
            expect(this.getChatLogs(3)).toContain('Way of the Scorpion is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should not allow chaining with multiple tattoos', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo2);

            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(false);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.scorpion.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 plays Way of the Scorpion to dishonor Togashi Kazue');
            expect(this.getChatLogs(5)).toContain('player1 uses Dragon Tattoo to play Way of the Scorpion');
            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Scorpion to dishonor Doji Challenger');
            expect(this.getChatLogs(3)).toContain('Way of the Scorpion is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should not react after your opponent targets your character with an event', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            expect(this.player2).toBeAbleToSelect(this.kazue);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);

            this.player2.clickCard(this.kazue);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow re-using reactions', function() {
            let hand = this.player1.hand.length;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                type: 'military',
                ring: 'fire'
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mantraOfFire);
            this.player1.clickCard(this.mantraOfFire);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);

            expect(this.kazue.fate).toBe(2);
            expect(this.player1.hand.length).toBe(hand + 1); //+2 from drawing, -1 from playing mantra

            expect(this.mantraOfFire.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('player1 plays Mantra of Fire to add a fate to Togashi Kazue and draw a card');
            expect(this.getChatLogs(4)).toContain('player1 uses Dragon Tattoo to play Mantra of Fire');
            expect(this.getChatLogs(3)).toContain('player1 plays Mantra of Fire to add a fate to Togashi Kazue and draw a card');
            expect(this.getChatLogs(2)).toContain('Mantra of Fire is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should just remove an event from the game if the copy has no legal targets', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.crane);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo2);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo1);

            this.player1.clickCard(this.dragonTattoo2);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.challenger.isHonored).toBe(true);
            expect(this.crane.location).toBe('removed from game');

            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Crane to honor Doji Challenger');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove Way of the Crane from the game');
        });

        it('should just remove a "max 1 per conflict" event from the game rather than resolve it again', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kata);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.kata.location).toBe('removed from game');

            expect(this.getChatLogs(4)).toContain('player1 plays Rising Stars Kata to give Togashi Kazue +3 military skill until the end of the conflict');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove Rising Stars Kata from the game');
        });

        it('should work with defend your honor - case 1: fail, fail', function() {
            this.player1.moveCard(this.dyh, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            this.player2.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dyh);
            this.player1.clickCard(this.dyh);
            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);

            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.dyh.location).toBe('removed from game');

            expect(this.getChatLogs(20)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(13)).toContain('The duel has no effect');
            expect(this.getChatLogs(12)).toContain('player1 uses Dragon Tattoo to play Defend Your Honor');
            expect(this.getChatLogs(11)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(4)).toContain('The duel has no effect');
            expect(this.getChatLogs(3)).toContain('Defend Your Honor is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should work with defend your honor - case 2: fail, success', function() {
            this.player1.moveCard(this.dyh, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            this.player2.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dyh);
            this.player1.clickCard(this.dyh);
            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);

            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.dyh.location).toBe('removed from game');

            expect(this.getChatLogs(20)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(13)).toContain('The duel has no effect');
            expect(this.getChatLogs(12)).toContain('player1 uses Dragon Tattoo to play Defend Your Honor');
            expect(this.getChatLogs(11)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(4)).toContain('Duel Effect: cancel the effects of Way of the Scorpion');
            expect(this.getChatLogs(3)).toContain('Defend Your Honor is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should work with defend your honor - case 3: success, success', function() {
            this.player1.moveCard(this.dyh, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            this.player2.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dyh);
            this.player1.clickCard(this.dyh);
            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);

            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.dyh.location).toBe('removed from game');

            expect(this.getChatLogs(20)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(13)).toContain('Duel Effect: cancel the effects of Way of the Scorpion');
            expect(this.getChatLogs(12)).toContain('player1 uses Dragon Tattoo to play Defend Your Honor');
            expect(this.getChatLogs(11)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(4)).toContain('The duel has no effect');
            expect(this.getChatLogs(3)).toContain('Defend Your Honor is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should work with defend your honor - case 4: success, fail', function() {
            this.player1.moveCard(this.dyh, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            this.player2.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dyh);
            this.player1.clickCard(this.dyh);
            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);

            this.player1.clickCard(this.kazue);
            this.player2.clickCard(this.kuwanan);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');

            expect(this.kazue.isDishonored).toBe(false);
            expect(this.dyh.location).toBe('removed from game');

            expect(this.getChatLogs(20)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(13)).toContain('Duel Effect: cancel the effects of Way of the Scorpion');
            expect(this.getChatLogs(12)).toContain('player1 uses Dragon Tattoo to play Defend Your Honor');
            expect(this.getChatLogs(11)).toContain('player1 plays Defend Your Honor to initiate a military duel : Togashi Kazue vs. Doji Kuwanan');
            expect(this.getChatLogs(4)).toContain('The duel has no effect');
            expect(this.getChatLogs(3)).toContain('Defend Your Honor is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should make you pay the fate cost twice', function() {
            this.player1.fate = 10;
            this.noMoreActions();
            let fate = this.player1.fate;
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.afwtd);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kuwanan);

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.afwtd.location).toBe('removed from game');
            expect(this.player1.fate).toBe(fate - 8); //4 fate, twice
        });

        it('should only remove from game if you can\'t pay the fate cost twice', function() {
            this.player1.fate = 5;
            this.noMoreActions();
            let fate = this.player1.fate;
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.afwtd);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.afwtd.location).toBe('removed from game');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove A Fate Worse Than Death from the game');
            expect(this.player1.fate).toBe(fate - 4);
        });

        it('should make you pay triggering costs twice', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.bentens);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            this.player1.clickCard(this.atsuko);
            expect(this.kazue.isHonored).toBe(true);
            expect(this.atsuko.bowed).toBe(true);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).not.toBeAbleToSelect(this.atsuko);
            this.player1.clickCard(this.scholar);
            expect(this.challenger.isHonored).toBe(true);
            expect(this.scholar.bowed).toBe(true);

            expect(this.bentens.location).toBe('removed from game');
        });

        it('should remove from game if you cannot pay the triggering costs twice', function() {
            this.noMoreActions();
            this.scholar.bowed = true;
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.bentens);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.kazue);
            expect(this.player1).not.toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            this.player1.clickCard(this.atsuko);
            expect(this.kazue.isHonored).toBe(true);
            expect(this.atsuko.bowed).toBe(true);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.bentens.location).toBe('removed from game');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove Benten\'s Touch from the game');
        });

        it('should not react if you choose a target without a tattoo', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.atsuko],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.atsuko);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not allow re-playing cards played via Mitsu', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.mitsu, this.kazue],
                type: 'military',
                ring: 'air'
            });

            this.player1.clickCard(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.hurricanePunch);
            this.player1.clickCard(this.hurricanePunch);
            this.player1.clickCard(this.kazue);

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.hurricanePunch.location).toBe('conflict deck');
        });

        it('watch commander - actions - should get two watch commander triggers', function() {
            let honor = this.player1.honor;
            this.player2.playAttachment(this.watchCommander, this.kuwanan);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo2);

            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kuwanan);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.watchCommander);
            this.player2.clickCard(this.watchCommander);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.watchCommander);
            this.player2.clickCard(this.watchCommander);

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.scorpion.location).toBe('removed from game');
            expect(this.player1.honor).toBe(honor - 2);

            expect(this.getChatLogs(4)).toContain('player2 uses Watch Commander to make player1 lose 1 honor');
            expect(this.getChatLogs(3)).toContain('player2 uses Watch Commander to make player1 lose 1 honor');
        });

        it('watch commander - reactions - should get two watch commander triggers', function() {
            let honor = this.player1.honor;
            this.player2.playAttachment(this.watchCommander, this.kuwanan);
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                type: 'military',
                ring: 'fire'
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mantraOfFire);
            this.player1.clickCard(this.mantraOfFire);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.watchCommander);
            this.player2.clickCard(this.watchCommander);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.watchCommander);
            this.player2.clickCard(this.watchCommander);

            expect(this.kazue.fate).toBe(2);
            expect(this.player1.honor).toBe(honor - 2);

            expect(this.mantraOfFire.location).toBe('removed from game');
            expect(this.getChatLogs(3)).toContain('player2 uses Watch Commander to make player1 lose 1 honor');
            expect(this.getChatLogs(2)).toContain('player2 uses Watch Commander to make player1 lose 1 honor');
        });
    });
});
