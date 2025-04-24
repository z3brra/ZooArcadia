<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250424085341 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE activity_picture (id INT AUTO_INCREMENT NOT NULL, activity_id INT NOT NULL, picture_id INT NOT NULL, INDEX IDX_1689396981C06096 (activity_id), INDEX IDX_16893969EE45BDBF (picture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE habitat_picture (id INT AUTO_INCREMENT NOT NULL, habitat_id INT NOT NULL, picture_id INT NOT NULL, INDEX IDX_4AC2702BAFFE2D26 (habitat_id), INDEX IDX_4AC2702BEE45BDBF (picture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_picture ADD CONSTRAINT FK_1689396981C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_picture ADD CONSTRAINT FK_16893969EE45BDBF FOREIGN KEY (picture_id) REFERENCES picture (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture ADD CONSTRAINT FK_4AC2702BAFFE2D26 FOREIGN KEY (habitat_id) REFERENCES habitat (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture ADD CONSTRAINT FK_4AC2702BEE45BDBF FOREIGN KEY (picture_id) REFERENCES habitat (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_picture DROP FOREIGN KEY FK_1689396981C06096
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_picture DROP FOREIGN KEY FK_16893969EE45BDBF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture DROP FOREIGN KEY FK_4AC2702BAFFE2D26
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture DROP FOREIGN KEY FK_4AC2702BEE45BDBF
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity_picture
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE habitat_picture
        SQL);
    }
}
