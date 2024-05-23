<?php

namespace App\Repository;

use App\Entity\Book;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Type;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 *
 * @method Book|null find($id, $lockMode = null, $lockVersion = null)
 * @method Book|null findOneBy(array $criteria, array $orderBy = null)
 * @method Book[]    findAll()
 * @method Book[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    //    /**
    //     * @return Book[] Returns an array of Book objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Book
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function getAll() {
        $qb = $this->createQueryBuilder('u');     
        return $qb->getQuery()->getArrayResult();
    }


    public function findFilteredBooks($arrayFilters) {
        $qb = $this->createQueryBuilder('books');

        if ($arrayFilters->title != "") {
            $qb->andWhere('books.title = :title');
            $qb->setParameter('title', $arrayFilters->title);
        }

        if ($arrayFilters->category != "") {
            $qb->andWhere('books.category = :category');
            $qb->setParameter('category', $arrayFilters->category);
        }
        
        if ($arrayFilters->publication != "") {
            $dateStartFilter = new DateTimeImmutable($arrayFilters->publication.'-01-01');
            $dateEndFilter = new DateTimeImmutable($arrayFilters->publication.'-12-31');

            $qb->andWhere('books.publishedAt >= :date_start');
            $qb->setParameter('date_start', $dateStartFilter);
            $qb->andWhere('books.publishedAt <= :date_end');           
            $qb->setParameter('date_end', $dateEndFilter);
        }
            
        return $qb->getQuery()->getArrayResult();
    }
}
