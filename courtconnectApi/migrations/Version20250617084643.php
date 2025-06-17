<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250617084643 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE vote (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, terrain_id INT DEFAULT NULL, resultat INT NOT NULL, INDEX IDX_5A108564A76ED395 (user_id), INDEX IDX_5A1085648A2D8B41 (terrain_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE vote ADD CONSTRAINT FK_5A108564A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE vote ADD CONSTRAINT FK_5A1085648A2D8B41 FOREIGN KEY (terrain_id) REFERENCES terrain (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE vote DROP FOREIGN KEY FK_5A108564A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE vote DROP FOREIGN KEY FK_5A1085648A2D8B41
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE vote
        SQL);
    }
}
