<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Créer le premier administrateur du système.'
)]
final class CreateAdminCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $helper = $this->getHelper('question');
        
        $questionFirstName = new Question("Veuillez entrer le prénom de l'administrateur : ");
        $firstName = $helper->ask($input, $output, $questionFirstName);
        
        $questionLastName = new Question("Veuillez entrer le nom de l'administrateur : ");
        $lastName = $helper->ask($input, $output, $questionLastName);

        $email = strtolower($firstName . '.' . $lastName . '@zooarcadia.com');
        $password = 'admin123';

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            $output->writeln('<error>Un administrateur existe déjà.</error>');
            return Command::FAILURE;
        }

        $user = new User();
        $user->setFirstName($firstName)
            ->setLastName($lastName)
            ->setEmail($email)
            ->setRoles(['ROLE_ADMIN'])
            ->setCreatedAt(new \DateTimeImmutable())
            ->setMustChangePassword(true);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $output->writeln('<info>Administrateur créé avec succès.</info>');
        $output->writeln("Email : $email");
        $output->writeln("Mot de passe : $password");

        return Command::SUCCESS;
    }
}
