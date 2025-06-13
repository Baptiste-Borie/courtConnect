<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250613100025 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7B03A8386
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_3BAE0AA7B03A8386 ON event
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event CHANGE date_heure date_heure VARCHAR(255) NOT NULL, CHANGE created_by_id created_by INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7DE12AB56 FOREIGN KEY (created_by) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_3BAE0AA7DE12AB56 ON event (created_by)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP FOREIGN KEY FK_C87653B1B03A8386
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C87653B1B03A8386 ON terrain
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain CHANGE created_at created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', CHANGE type_filet type_filet VARCHAR(255) NOT NULL, CHANGE created_by_id created_by INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD CONSTRAINT FK_C87653B1DE12AB56 FOREIGN KEY (created_by) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C87653B1DE12AB56 ON terrain (created_by)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7DE12AB56
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_3BAE0AA7DE12AB56 ON event
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event CHANGE date_heure date_heure DATETIME NOT NULL, CHANGE created_by created_by_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_3BAE0AA7B03A8386 ON event (created_by_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP FOREIGN KEY FK_C87653B1DE12AB56
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C87653B1DE12AB56 ON terrain
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain CHANGE created_at created_at DATETIME NOT NULL, CHANGE type_filet type_filet DOUBLE PRECISION NOT NULL, CHANGE created_by created_by_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD CONSTRAINT FK_C87653B1B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C87653B1B03A8386 ON terrain (created_by_id)
        SQL);
    }
}
