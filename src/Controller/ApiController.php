<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Booking;
use App\Repository\BookingRepository;
use App\Repository\BookRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

$encoders = [new XmlEncoder(), new JsonEncoder()];
$normalizers = [new ObjectNormalizer()];

$serializer = new Serializer($normalizers, $encoders);


#[Route('/api')]
class ApiController extends AbstractController
{
    #[Route('/', name: 'app_api')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to API controller!',
        ]);
    }

    #[Route('/list_all_book', name: 'list_all_book_app')]
    public function listAllBooks(BookRepository $bookRepository) 
    {
        $books = $bookRepository->getAll();
        
        if (!$books) {
            return new Response('Books not found', Response::HTTP_NOT_FOUND);
        }
        return $this->json($books);
    }


    #[Route('/list_book', name: 'list_book_app')]
    public function listBook(BookRepository $bookRepository, Request $request)
    {
        $filters = json_decode($request->query->get('filters')); 
        $filteredBooks = $bookRepository->findFilteredBooks($filters);

        return $this->json($filteredBooks);
    }

    #[Route('/user_booking_id/{id}', name: 'user_booking_id_app')]
    public function userBookingId(BookingRepository $bookingRepository, Request $request, $id, SerializerInterface $serializer)
    {
        $userBooking = $bookingRepository->findBy(['book' => $id]);

        $jsonContent = $serializer->serialize($userBooking, 'json', []);
        return new JsonResponse($jsonContent);
    }

    #[Route('/user_booking_email/{email}', name: 'user_booking_email_app')]
    public function userBookingEmail(BookingRepository $bookingRepository, Request $request, $email, SerializerInterface $serializer)
    {
        $userBooking = $bookingRepository->findBy(['user' => $email]);

        $jsonContent = $serializer->serialize($userBooking, 'json', []);
        return new JsonResponse($jsonContent);
    }

    #[Route('/booking_info/{bookId}', name: 'booking_info_app')]
    public function bookingInfo(BookingRepository $bookingRepository, Request $request, $bookId)
    {
        $bookingInfo = $bookingRepository->findBy(['book' => $bookId]);
        if ($bookingInfo === []) {
            return new Response('The book is available', Response::HTTP_OK);
        } 
        return new Response('The book is not available', Response::HTTP_NOT_ACCEPTABLE);
    }

    #[Route('/new_booking', name: 'new_booking_app')]
    public function newBooking(BookingRepository $bookingRepository, BookRepository $bookRepository, ManagerRegistry $doctrine, Request $request)
    {
        $information = json_decode($request->getContent());

        $entityManager = $doctrine->getManager();
        
        $data = new Booking();
        $data->setUser($information->user);
        $data->setStart(new DateTime($information->start));
        $data->setEnd(new DateTime($information->end));
        $data->setStatus($information->status);
        $data->setBook($information->book_id);

        $entityManager->persist($data);
        $entityManager->flush();
        
        return new Response('Booking done', Response::HTTP_OK);
    }

    #[Route('/delete_booking/{bookId}', name: 'delete_booking_app')]
    public function deleteBooking(BookingRepository $bookingRepository, ManagerRegistry $doctrine, $bookId)
    {
        $entityManager = $doctrine->getManager();

        $book = $bookingRepository->findBy(['book' => $bookId]);
        $booking = $bookingRepository->find($book[0]->getId());

        $entityManager->remove($booking);
        $entityManager->flush();

        return new Response('Booking deleted');
    }
}
