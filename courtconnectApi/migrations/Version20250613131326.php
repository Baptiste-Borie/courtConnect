<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250613131326 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE type_event (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE type_filet (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE type_panier (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE type_sol (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP type, CHANGE niveau niveau INT NOT NULL, CHANGE etat etat INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain DROP sol, DROP type_filet, DROP type_panier, CHANGE nb_panier nb_panier INT NOT NULL, CHANGE etat etat INT NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP TABLE type_event
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE type_filet
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE type_panier
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE type_sol
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD type VARCHAR(255) NOT NULL, CHANGE niveau niveau VARCHAR(255) NOT NULL, CHANGE etat etat VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE terrain ADD sol VARCHAR(255) NOT NULL, ADD type_filet VARCHAR(255) NOT NULL, ADD type_panier VARCHAR(255) NOT NULL, CHANGE nb_panier nb_panier DOUBLE PRECISION NOT NULL, CHANGE etat etat VARCHAR(255) NOT NULL
        SQL);
    }
}
