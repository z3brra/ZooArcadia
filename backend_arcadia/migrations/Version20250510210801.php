<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250510210801 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE habitat_report (id INT AUTO_INCREMENT NOT NULL, created_by_id INT NOT NULL, habitat_id INT NOT NULL, uuid VARCHAR(36) NOT NULL, state VARCHAR(64) NOT NULL, comment LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_6E7AD13FB03A8386 (created_by_id), INDEX IDX_6E7AD13FAFFE2D26 (habitat_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_report ADD CONSTRAINT FK_6E7AD13FB03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_report ADD CONSTRAINT FK_6E7AD13FAFFE2D26 FOREIGN KEY (habitat_id) REFERENCES habitat (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat ADD last_state VARCHAR(64) DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_report DROP FOREIGN KEY FK_6E7AD13FB03A8386
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_report DROP FOREIGN KEY FK_6E7AD13FAFFE2D26
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE habitat_report
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat DROP last_state
        SQL);
    }
}
