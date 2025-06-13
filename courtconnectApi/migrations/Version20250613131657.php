<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250613131657 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD type_event_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7BC08CF77 FOREIGN KEY (type_event_id) REFERENCES type_event (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_3BAE0AA7BC08CF77 ON event (type_event_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD type_filet_id INT DEFAULT NULL, ADD type_panier_id INT DEFAULT NULL, ADD type_sol_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD CONSTRAINT FK_C87653B1F3CE446A FOREIGN KEY (type_filet_id) REFERENCES type_filet (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD CONSTRAINT FK_C87653B143BBD36C FOREIGN KEY (type_panier_id) REFERENCES type_panier (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD CONSTRAINT FK_C87653B1EC3101F1 FOREIGN KEY (type_sol_id) REFERENCES type_sol (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C87653B1F3CE446A ON terrain (type_filet_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C87653B143BBD36C ON terrain (type_panier_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C87653B1EC3101F1 ON terrain (type_sol_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP FOREIGN KEY FK_C87653B1F3CE446A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP FOREIGN KEY FK_C87653B143BBD36C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP FOREIGN KEY FK_C87653B1EC3101F1
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C87653B1F3CE446A ON terrain
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C87653B143BBD36C ON terrain
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C87653B1EC3101F1 ON terrain
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP type_filet_id, DROP type_panier_id, DROP type_sol_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7BC08CF77
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_3BAE0AA7BC08CF77 ON event
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP type_event_id
        SQL);
    }
}
