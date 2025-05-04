<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250504132555 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture DROP FOREIGN KEY FK_4AC2702BEE45BDBF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture ADD CONSTRAINT FK_4AC2702BEE45BDBF FOREIGN KEY (picture_id) REFERENCES picture (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture DROP FOREIGN KEY FK_4AC2702BEE45BDBF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE habitat_picture ADD CONSTRAINT FK_4AC2702BEE45BDBF FOREIGN KEY (picture_id) REFERENCES habitat (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
    }
}
