describe('Togashi Hoshi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 100,
                    inPlay: ['togashi-hoshi', 'mirumoto-raitsugu'],
                    hand: ['fiery-madness', 'banzai', 'talisman-of-the-sun', 'ancestral-daisho', 'greater-understanding', 'jade-tetsubo', 'ornate-fan'],
                    dynastyDiscard: ['ancestral-armory']
                },
                player2: {
                    inPlay: ['agasha-swordsmith'],
                    hand: ['cloud-the-mind', 'fine-katana', 'assassination', 'let-go']
                }
            });

            this.hoshi = this.player1.findCardByName('togashi-hoshi');
            this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
            this.madness = this.player1.findCardByName('fiery-madness');
            this.talisman = this.player1.findCardByName('talisman-of-the-sun');
            this.banzai = this.player1.findCardByName('banzai');
            this.ancestralDaisho = this.player1.findCardByName('ancestral-daisho');
            this.greater = this.player1.findCardByName('greater-understanding');
            this.jadeTetsubo = this.player1.findCardByName('jade-tetsubo');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.armory = this.player1.placeCardInProvince('ancestral-armory', 'province 1');

            this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            this.assassination = this.player2.findCardByName('assassination');
            this.letGo = this.player2.findCardByName('let-go');
            this.cloud = this.player2.findCardByName('cloud-the-mind');
            this.katana = this.player2.findCardByName('fine-katana');

            this.shameful = this.player2.findCardByName('shameful-display', 'province 1');

            this.player1.playAttachment(this.madness, this.mirumotoRaitsugu);
            this.player2.playAttachment(this.cloud, this.mirumotoRaitsugu);
            this.player1.playAttachment(this.talisman, this.mirumotoRaitsugu);
            this.player2.playAttachment(this.katana, this.agashaSwordsmith);
            this.player1.playAttachment(this.fan, this.agashaSwordsmith);
            this.player2.pass();
            this.player1.playAttachment(this.ancestralDaisho, this.mirumotoRaitsugu);
            this.player2.pass();
            this.player1.playAttachment(this.jadeTetsubo, this.mirumotoRaitsugu);
            this.player2.pass();
            this.player1.clickCard(this.greater);
            this.player1.clickRing('fire');
            this.player2.pass();
        });

        it('should only allow you to target attachments on characters you control', function() {
            this.player1.clickCard(this.hoshi);
            expect(this.player1).toBeAbleToSelect(this.madness);
            expect(this.player1).toBeAbleToSelect(this.cloud);
            expect(this.player1).toBeAbleToSelect(this.talisman);
            expect(this.player1).not.toBeAbleToSelect(this.katana);
            expect(this.player1).not.toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.ancestralDaisho);
            expect(this.player1).toBeAbleToSelect(this.jadeTetsubo);
            expect(this.player1).not.toBeAbleToSelect(this.greater);
        });

        it('should detatch and turn the attachment into a character', function() {
            expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.jadeTetsubo);
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.mirumotoRaitsugu.attachments.toArray()).not.toContain(this.jadeTetsubo);
            expect(this.jadeTetsubo.location).toBe('play area');
            expect(this.jadeTetsubo.type).toBe('character');
            expect(this.jadeTetsubo.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should be able to assigned into a conflict', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Initiate Conflict');
            this.player1.clickCard(this.hoshi);
            expect(this.hoshi.inConflict).toBe(true);
            this.player1.clickCard(this.mirumotoRaitsugu);
            expect(this.mirumotoRaitsugu.inConflict).toBe(true);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.jadeTetsubo.inConflict).toBe(true);
        });

        it('should contribute skill equal to printed modifiers (mil)', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.talisman);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.talisman],
                defenders: [],
                type: 'military'
            });

            expect(this.getChatLogs(2)).toContain('player1 has initiated a military conflict with skill 1');
        });

        it('should contribute skill equal to printed modifiers (pol)', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.talisman);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.talisman],
                defenders: [],
                type: 'political'
            });

            expect(this.getChatLogs(2)).toContain('player1 has initiated a political conflict with skill 1');
        });

        it('should be able to have negative base skill', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.madness);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.madness],
                defenders: [],
                type: 'military'
            });

            expect(this.getChatLogs(2)).toContain('player1 has initiated a military conflict with skill 0');
            this.player2.pass();
            this.player1.clickCard(this.banzai);
            this.player1.clickCard(this.madness);
            this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
            this.player1.clickCard(this.madness);
            this.player1.clickPrompt('Done');
            expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 2 Defender: 0');
        });

        it('should not allow using abilities that refer to the parent', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.jadeTetsubo],
                defenders: [this.agashaSwordsmith],
                type: 'military'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow using abilities that don\'t refer to the parent', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.talisman);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.agashaSwordsmith],
                defenders: [this.mirumotoRaitsugu],
                type: 'military'
            });

            this.player1.clickCard(this.talisman);
            expect(this.player1).toHavePrompt('Talisman of the Sun');
        });

        it('should not be targetable by let go', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.talisman);
            expect(this.player2).toHavePrompt('Action Window');

            this.player2.clickCard(this.letGo);
            expect(this.player2).toBeAbleToSelect(this.cloud);
            expect(this.player2).not.toBeAbleToSelect(this.talisman);
        });

        it('should be able to be assassinated', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [],
                type: 'military'
            });

            this.player2.clickCard(this.assassination);
            expect(this.player2).toBeAbleToSelect(this.jadeTetsubo);
            this.player2.clickCard(this.jadeTetsubo);
            expect(this.jadeTetsubo.location).toBe('conflict discard pile');
        });

        it('should revert back to an attachment', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.jadeTetsubo);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [],
                type: 'military'
            });

            this.player2.clickCard(this.assassination);
            expect(this.player2).toBeAbleToSelect(this.jadeTetsubo);
            this.player2.clickCard(this.jadeTetsubo);
            expect(this.jadeTetsubo.location).toBe('conflict discard pile');
            expect(this.jadeTetsubo.type).toBe('attachment');
            this.player1.clickCard(this.armory);
            expect(this.player1).toBeAbleToSelect(this.jadeTetsubo);
            this.player1.clickCard(this.jadeTetsubo);
            this.player2.pass();
            this.player1.clickCard(this.jadeTetsubo);
            let mil = this.mirumotoRaitsugu.getMilitarySkill();
            this.player1.clickCard(this.mirumotoRaitsugu);
            expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.jadeTetsubo);
            expect(this.mirumotoRaitsugu.getMilitarySkill()).toBe(mil + 3);
        });

        it('ancestral attachments should not return to hand if detatched', function() {
            this.player1.clickCard(this.hoshi);
            this.player1.clickCard(this.ancestralDaisho);
            expect(this.player2).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [],
                type: 'military'
            });

            this.player2.clickCard(this.assassination);
            expect(this.player2).toBeAbleToSelect(this.ancestralDaisho);
            this.player2.clickCard(this.ancestralDaisho);
            expect(this.ancestralDaisho.location).toBe('conflict discard pile');
        });
    });
});
