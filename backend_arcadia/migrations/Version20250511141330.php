<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250511141330 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE animal_report (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, animal_id INT NOT NULL, uuid VARCHAR(36) NOT NULL, state VARCHAR(64) NOT NULL, comment LONGTEXT DEFAULT NULL, recommanded_food JSON NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_7EDEB258B03A8386 (created_by_id), INDEX IDX_7EDEB2588E962C16 (animal_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE animal_report ADD CONSTRAINT FK_7EDEB258B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE animal_report ADD CONSTRAINT FK_7EDEB2588E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE animal ADD last_state VARCHAR(64) DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE animal_report DROP FOREIGN KEY FK_7EDEB258B03A8386
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE animal_report DROP FOREIGN KEY FK_7EDEB2588E962C16
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE animal_report
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE animal DROP last_state
        SQL);
    }
}
