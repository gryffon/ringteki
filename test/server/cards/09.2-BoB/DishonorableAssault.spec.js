describe('Dishonorable Assault', function() {
    integration(function() {
        describe('Dishonorable Assault\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth', 'doji-whisperer', 'shinjo-ambusher', 'callow-delegate', 'young-harrier', 'steward-of-law']
                    },
                    player2: {
                        provinces: ['dishonorable-assault'],
                        hand: ['fine-katana','ornate-fan', 'assassination']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.callow = this.player1.findCardByName('callow-delegate');
                this.harrier = this.player1.findCardByName('young-harrier');
                this.steward = this.player1.findCardByName('steward-of-law');

                this.ambusher.dishonor();

                this.assault = this.player2.findCardByName('dishonorable-assault');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('Should force you to choose target equal to the amount of cards discarded', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 2 cards to discard');
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.assassination);

                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.katana);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Choose 2 characters');
            });

            it('Should not let you choose invalid targets (Harrier)', function() {
                this.whisperer.honor();
                this.player1.clickCard(this.harrier);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 1 card to discard');
            });

            it('Should not let you trigger if there are no valid targets', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.steward],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Should dishonor the chosen characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 2 cards to discard');
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.assassination);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player2).toHavePrompt('Choose 2 characters');
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.youth);
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickPrompt('Done');

                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);

                expect(this.getChatLogs(3)).toContain('player2 uses Dishonorable Assault to discard Fine Katana, Ornate Fan and dishonor Doji Whisperer and Moto Youth');
            });

            it('Should not let you choose more characters than you chose cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher, this.harrier],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 3 cards to discard');
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickPrompt('Done');

                expect(this.player2).toHavePrompt('Choose 2 characters');
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickCard(this.harrier);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);
                expect(this.harrier.isDishonored).toBe(false);

                expect(this.getChatLogs(3)).toContain('player2 uses Dishonorable Assault to discard Fine Katana, Ornate Fan and dishonor Doji Whisperer and Moto Youth');
            });

            it('Should not let you choose more cards than you have targets', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 2 cards to discard');
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.assassination);
                this.player2.clickPrompt('Done');

                expect(this.player2).toHavePrompt('Choose 2 characters');
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.assassination.location).toBe('hand');
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);

                expect(this.getChatLogs(3)).toContain('player2 uses Dishonorable Assault to discard Fine Katana, Ornate Fan and dishonor Doji Whisperer and Moto Youth');
            });

            it('Should not let you choose less characters than you discarded cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 2 cards to discard');
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.assassination);
                this.player2.clickPrompt('Done');

                expect(this.player2).toHavePrompt('Choose 2 characters');
                this.player2.clickCard(this.whisperer);
                expect(this.player2).not.toHavePromptButton('Done');
                this.player2.clickCard(this.youth);
                expect(this.player2).toHavePromptButton('Done');
            });
        });

        describe('Dishonorable Assault\'s events', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth', 'doji-whisperer', 'shinjo-ambusher', 'shosuro-hyobu', 'ardent-omoidasu'],
                        hand: ['finger-of-jade', 'pathfinder-s-blade']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        provinces: ['dishonorable-assault'],
                        hand: ['fine-katana','ornate-fan', 'assassination']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.hyobu = this.player1.findCardByName('shosuro-hyobu');
                this.omoidasu = this.player1.findCardByName('ardent-omoidasu');
                this.jade = this.player1.findCardByName('finger-of-jade');
                this.blade = this.player1.findCardByName('pathfinder-s-blade');

                this.player1.playAttachment(this.jade, this.ambusher);

                this.assault = this.player2.findCardByName('dishonorable-assault');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should allow Hyobu to trigger', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 3 cards to discard');
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.assassination);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hyobu);
                this.player1.clickCard(this.hyobu);
                this.player1.clickCard(this.challenger);
                expect(this.challenger.isDishonored).toBe(true);

                expect(this.player2).toHavePrompt('Choose 2 characters');
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.youth);
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickPrompt('Done');

                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);

                expect(this.getChatLogs(2)).toContain('player1 uses Shosuro Hyobu to dishonor Doji Challenger');
                expect(this.getChatLogs(1)).toContain('player2 uses Dishonorable Assault to discard Fine Katana, Ornate Fan and dishonor Doji Whisperer and Moto Youth');
            });

            it('should allow Omoidasu to trigger', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 3 cards to discard');
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).toBeAbleToSelect(this.fan);
                expect(this.player2).toBeAbleToSelect(this.assassination);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hyobu);
                this.player1.pass();

                expect(this.player2).toHavePrompt('Choose 2 characters');
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.youth);
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickPrompt('Done');

                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);

                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.omoidasu);
                this.player1.clickCard(this.omoidasu);
                this.player1.clickCard(this.whisperer);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1.honor).toBe(honor1 + 2);
                expect(this.player2.honor).toBe(honor2 - 2);
            });

            it('should allow Finger of Jade to cancel DH on everyone', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 3 cards to discard');
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.assassination);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hyobu);
                this.player1.pass();

                expect(this.player2).toHavePrompt('Choose 3 characters');
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickCard(this.ambusher);
                this.player2.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.jade);
                this.player1.clickCard(this.jade);
                expect(this.whisperer.isDishonored).toBe(false);
                expect(this.youth.isDishonored).toBe(false);
                expect(this.ambusher.isDishonored).toBe(false);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow PFB to cancel DH on everyone', function() {
                this.player2.pass();
                this.player1.playAttachment(this.blade, this.youth);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player2).toHavePrompt('Choose up to 3 cards to discard');
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.assassination);
                this.player2.clickPrompt('Done');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.fan.location).toBe('conflict discard pile');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hyobu);
                this.player1.pass();

                expect(this.player2).toHavePrompt('Choose 3 characters');
                this.player2.clickCard(this.whisperer);
                this.player2.clickCard(this.youth);
                this.player2.clickCard(this.ambusher);
                this.player2.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.blade);
                this.player1.clickCard(this.blade);

                expect(this.whisperer.isDishonored).toBe(false);
                expect(this.youth.isDishonored).toBe(false);
                expect(this.ambusher.isDishonored).toBe(false);

                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Dishonorable Assault\'s ability (Hantei)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth', 'doji-whisperer', 'shinjo-ambusher', 'callow-delegate', 'young-harrier', 'hantei-xxxviii']
                    },
                    player2: {
                        provinces: ['dishonorable-assault'],
                        hand: ['fine-katana','ornate-fan', 'assassination']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.callow = this.player1.findCardByName('callow-delegate');
                this.harrier = this.player1.findCardByName('young-harrier');
                this.hantei = this.player1.findCardByName('hantei-xxxviii');

                this.ambusher.dishonor();

                this.assault = this.player2.findCardByName('dishonorable-assault');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('Should allow Hantei to interrupt', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher, this.callow, this.harrier],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
            });

            it('Should allow Hantei to select targets after cards are discarded, and force choosing the correct # of characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher, this.callow, this.harrier],
                    defenders: [],
                    province: this.assault
                });

                this.player2.clickCard(this.assault);
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);

                //Pay costs
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.katana);
                this.player2.clickPrompt('Done');

                //Now let Hantei pick targets
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.youth);
                expect(this.player1).not.toBeAbleToSelect(this.ambusher);
                expect(this.player1).toBeAbleToSelect(this.callow);
                expect(this.player1).toBeAbleToSelect(this.harrier);

                this.player1.clickCard(this.callow);
                this.player1.clickCard(this.harrier);
                this.player1.clickPrompt('Done');

                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.whisperer.isDishonored).toBe(false);
                expect(this.youth.isDishonored).toBe(false);
                expect(this.callow.isDishonored).toBe(true);
                expect(this.harrier.isDishonored).toBe(true);
            });
        });

        describe('Dishonorable Assault\'s ability (Keeper of Secret Names)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth', 'doji-whisperer', 'shinjo-ambusher', 'keeper-of-secret-names'],
                        hand: ['duty', 'policy-debate']
                    },
                    player2: {
                        provinces: ['dishonorable-assault'],
                        hand: ['fine-katana','ornate-fan', 'assassination']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.keeper = this.player1.findCardByName('keeper-of-secret-names');
                this.duty = this.player1.findCardByName('duty');
                this.policyDebate = this.player1.findCardByName('policy-debate');

                this.assault = this.player2.findCardByName('dishonorable-assault');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('Should allow keeper of secret names to use the province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth, this.whisperer, this.ambusher],
                    defenders: [],
                    province: this.assault
                });

                this.player2.pass();
                this.player1.clickCard(this.keeper);
                this.player1.clickCard(this.assault);
                expect(this.player1).toHavePrompt('Choose up to 2 cards to discard');
                this.player1.clickCard(this.duty);
                this.player1.clickCard(this.policyDebate);
                this.player1.clickPrompt('Done');

                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.youth);
                expect(this.player1).toBeAbleToSelect(this.ambusher);

                this.player1.clickCard(this.whisperer);
                this.player1.clickCard(this.youth);
                this.player1.clickPrompt('Done');

                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.youth.isDishonored).toBe(true);
                expect(this.duty.location).toBe('conflict discard pile');
                expect(this.policyDebate.location).toBe('conflict discard pile');
            });
        });
    });
});
