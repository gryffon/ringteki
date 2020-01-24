describe('Iuchi Rimei', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan', 'doomed-shugenja'],
                    hand: ['fine-katana', 'cloud-the-mind', 'finger-of-jade', 'height-of-fashion', 'force-of-the-river']
                },
                player2: {
                    inPlay: ['iuchi-rimei', 'hida-kisada'],
                    hand: ['ornate-fan', 'calling-in-favors']
                }
            });

            this.rimei = this.player2.findCardByName('iuchi-rimei');
            this.kisada = this.player2.findCardByName('hida-kisada');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.calling = this.player2.findCardByName('calling-in-favors');

            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.cloud = this.player1.findCardByName('cloud-the-mind');
            this.katana = this.player1.findCardByName('fine-katana');
            this.finger = this.player1.findCardByName('finger-of-jade');
            this.fashion = this.player1.findCardByName('height-of-fashion');
            this.river = this.player1.findCardByName('force-of-the-river');

            this.player1.playAttachment(this.katana, this.doomed);
            this.player2.playAttachment(this.fan, this.doomed);
            this.player1.playAttachment(this.finger, this.kuwanan);
            this.player2.pass();
            this.player1.playAttachment(this.cloud, this.kisada);
            this.player2.pass();
            this.player1.playAttachment(this.fashion, this.kuwanan);
            this.player2.pass();
            this.player1.playAttachment(this.river, this.doomed);
        });


        it('should only allow targeting an attachment with cost 1 or less controlled by opponent', function() {
            this.player2.clickCard(this.rimei);
            expect(this.player2).toBeAbleToSelect(this.cloud);
            expect(this.player2).toBeAbleToSelect(this.finger);
            expect(this.player2).not.toBeAbleToSelect(this.fan);
            expect(this.player2).toBeAbleToSelect(this.katana);
            expect(this.player2).not.toBeAbleToSelect(this.fashion);
            expect(this.player2).toBeAbleToSelect(this.river);
        });

        it('should not allow targeting an attachment that has changed control', function() {
            this.player2.clickCard(this.calling);
            this.player2.clickCard(this.katana);
            this.player2.clickCard(this.rimei);

            this.player1.pass();

            this.player2.clickCard(this.rimei);
            expect(this.player2).toBeAbleToSelect(this.cloud);
            expect(this.player2).toBeAbleToSelect(this.finger);
            expect(this.player2).not.toBeAbleToSelect(this.fan);
            expect(this.player2).not.toBeAbleToSelect(this.katana);
        });

        it('should allow moving the attachment to another character controlled by the attachment parent', function() {
            this.player2.clickCard(this.rimei);
            this.player2.clickCard(this.cloud);
            expect(this.player2).toBeAbleToSelect(this.rimei);
            expect(this.player2).not.toBeAbleToSelect(this.kisada);
            expect(this.player2).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.doomed);

            this.player2.clickCard(this.rimei);
            expect(this.rimei.attachments.toArray()).toContain(this.cloud);
            expect(this.kisada.attachments.toArray()).not.toContain(this.cloud);

            expect(this.getChatLogs(2)).toContain('player2 uses Iuchi Rimei to move Cloud the Mind to another character');
            expect(this.getChatLogs(1)).toContain('player2 moves Cloud the Mind to Iuchi Rimei');
        });

        it('should allow moving an attachment that can only be attached to \'characters you control\'', function() {
            this.player2.clickCard(this.rimei);
            this.player2.clickCard(this.finger);
            expect(this.player2).not.toBeAbleToSelect(this.rimei);
            expect(this.player2).not.toBeAbleToSelect(this.kisada);
            expect(this.player2).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player2).toBeAbleToSelect(this.doomed);
            this.player2.clickCard(this.doomed);

            expect(this.kuwanan.attachments.toArray()).not.toContain(this.finger);
            expect(this.doomed.attachments.toArray()).toContain(this.finger);

            expect(this.finger.location).toBe('play area');
        });

        it('finger of jade should not stop', function() {
            this.player2.clickCard(this.rimei);
            this.player2.clickCard(this.katana);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            this.player2.clickCard(this.kuwanan);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');

            expect(this.kuwanan.attachments.toArray()).toContain(this.katana);
            expect(this.doomed.attachments.toArray()).not.toContain(this.katana);
        });

        it('should discard newly illegal attachments', function() {
            this.player2.clickCard(this.rimei);
            this.player2.clickCard(this.river);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            this.player2.clickCard(this.kuwanan);
            expect(this.river.location).toBe('conflict discard pile');
            expect(this.getChatLogs(3)).toContain('player2 uses Iuchi Rimei to move Force of the River to another character');
            expect(this.getChatLogs(2)).toContain('player2 moves Force of the River to Doji Kuwanan');
        });
    });
});
