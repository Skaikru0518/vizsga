from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from booklist.models import Book
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with 50 real books'

    def handle(self, *args, **kwargs):
        # Get or create a default user for seeding
        user, created = User.objects.get_or_create(
            username='bookadmin',
            defaults={
                'email': 'admin@books.com',
                'first_name': 'Book',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )

        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created default user: bookadmin'))

        # Clear existing books
        Book.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing books'))

        # Real book data
        books_data = [
            {
                'title': 'To Kill a Mockingbird',
                'author': 'Harper Lee',
                'description': 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
                'isbn': '9780061120084',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg'
            },
            {
                'title': '1984',
                'author': 'George Orwell',
                'description': 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
                'isbn': '9780451524935',
                'genre': 'Dystopian Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'
            },
            {
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'description': 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
                'isbn': '9780141439518',
                'genre': 'Romance',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg'
            },
            {
                'title': 'The Great Gatsby',
                'author': 'F. Scott Fitzgerald',
                'description': 'A novel about the impossibility of recapturing the past and the difficulty of altering one\'s future.',
                'isbn': '9780743273565',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg'
            },
            {
                'title': 'Harry Potter and the Philosopher\'s Stone',
                'author': 'J.K. Rowling',
                'description': 'A young wizard\'s journey begins at Hogwarts School of Witchcraft and Wizardry.',
                'isbn': '9780747532699',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg'
            },
            {
                'title': 'The Hobbit',
                'author': 'J.R.R. Tolkien',
                'description': 'A fantasy novel about the quest of home-loving hobbit Bilbo Baggins.',
                'isbn': '9780547928227',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg'
            },
            {
                'title': 'The Catcher in the Rye',
                'author': 'J.D. Salinger',
                'description': 'A story about teenage rebellion and alienation narrated by Holden Caulfield.',
                'isbn': '9780316769174',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg'
            },
            {
                'title': 'The Lord of the Rings',
                'author': 'J.R.R. Tolkien',
                'description': 'An epic high-fantasy novel about the quest to destroy the One Ring.',
                'isbn': '9780544003415',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg'
            },
            {
                'title': 'Animal Farm',
                'author': 'George Orwell',
                'description': 'An allegorical novella reflecting events leading up to the Russian Revolution.',
                'isbn': '9780451526342',
                'genre': 'Political Satire',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg'
            },
            {
                'title': 'Brave New World',
                'author': 'Aldous Huxley',
                'description': 'A dystopian novel set in a futuristic World State of genetically modified citizens.',
                'isbn': '9780060850524',
                'genre': 'Dystopian Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg'
            },
            {
                'title': 'The Chronicles of Narnia',
                'author': 'C.S. Lewis',
                'description': 'A series of seven fantasy novels set in the magical land of Narnia.',
                'isbn': '9780066238500',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780066238500-L.jpg'
            },
            {
                'title': 'Fahrenheit 451',
                'author': 'Ray Bradbury',
                'description': 'A dystopian novel about a future where books are outlawed and burned.',
                'isbn': '9781451673319',
                'genre': 'Dystopian Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg'
            },
            {
                'title': 'Moby-Dick',
                'author': 'Herman Melville',
                'description': 'The narrative of Captain Ahab\'s obsessive quest to kill the white whale.',
                'isbn': '9780142437247',
                'genre': 'Adventure',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg'
            },
            {
                'title': 'Jane Eyre',
                'author': 'Charlotte Brontë',
                'description': 'A novel following the emotions and experiences of its eponymous heroine.',
                'isbn': '9780141441146',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg'
            },
            {
                'title': 'Wuthering Heights',
                'author': 'Emily Brontë',
                'description': 'A tale of passion and revenge set on the Yorkshire moors.',
                'isbn': '9780141439556',
                'genre': 'Gothic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg'
            },
            {
                'title': 'The Odyssey',
                'author': 'Homer',
                'description': 'An ancient Greek epic poem about Odysseus\'s journey home after the Trojan War.',
                'isbn': '9780140268867',
                'genre': 'Epic Poetry',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780140268867-L.jpg'
            },
            {
                'title': 'Crime and Punishment',
                'author': 'Fyodor Dostoevsky',
                'description': 'A psychological novel about the mental anguish of a poor student who murders.',
                'isbn': '9780486415871',
                'genre': 'Philosophical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780486415871-L.jpg'
            },
            {
                'title': 'The Picture of Dorian Gray',
                'author': 'Oscar Wilde',
                'description': 'A philosophical novel about a man whose portrait ages while he remains young.',
                'isbn': '9780141439570',
                'genre': 'Gothic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg'
            },
            {
                'title': 'Les Misérables',
                'author': 'Victor Hugo',
                'description': 'A French historical novel following the lives of several characters through social injustice.',
                'isbn': '9780451419439',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg'
            },
            {
                'title': 'The Adventures of Huckleberry Finn',
                'author': 'Mark Twain',
                'description': 'A novel about a young boy\'s adventures along the Mississippi River.',
                'isbn': '9780486280615',
                'genre': 'Adventure',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780486280615-L.jpg'
            },
            {
                'title': 'Dracula',
                'author': 'Bram Stoker',
                'description': 'A Gothic horror novel about the vampire Count Dracula.',
                'isbn': '9780141439846',
                'genre': 'Gothic Horror',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg'
            },
            {
                'title': 'Frankenstein',
                'author': 'Mary Shelley',
                'description': 'A novel about a scientist who creates a sapient creature in an unorthodox experiment.',
                'isbn': '9780486282114',
                'genre': 'Gothic Horror',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780486282114-L.jpg'
            },
            {
                'title': 'The Divine Comedy',
                'author': 'Dante Alighieri',
                'description': 'An Italian long narrative poem describing the author\'s journey through Hell, Purgatory, and Paradise.',
                'isbn': '9780142437223',
                'genre': 'Epic Poetry',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780142437223-L.jpg'
            },
            {
                'title': 'War and Peace',
                'author': 'Leo Tolstoy',
                'description': 'A novel that chronicles the history of the French invasion of Russia.',
                'isbn': '9780199232765',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780199232765-L.jpg'
            },
            {
                'title': 'Anna Karenina',
                'author': 'Leo Tolstoy',
                'description': 'A novel about an aristocratic woman\'s tragic affair with a military officer.',
                'isbn': '9780143035008',
                'genre': 'Romance',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg'
            },
            {
                'title': 'The Brothers Karamazov',
                'author': 'Fyodor Dostoevsky',
                'description': 'A philosophical novel set in 19th-century Russia about faith, doubt, and reason.',
                'isbn': '9780374528379',
                'genre': 'Philosophical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780374528379-L.jpg'
            },
            {
                'title': 'Don Quixote',
                'author': 'Miguel de Cervantes',
                'description': 'A Spanish novel about a man who loses his sanity and becomes a knight-errant.',
                'isbn': '9780142437230',
                'genre': 'Adventure',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780142437230-L.jpg'
            },
            {
                'title': 'One Hundred Years of Solitude',
                'author': 'Gabriel García Márquez',
                'description': 'A landmark novel telling the multi-generational story of the Buendía family.',
                'isbn': '9780060883287',
                'genre': 'Magical Realism',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg'
            },
            {
                'title': 'The Alchemist',
                'author': 'Paulo Coelho',
                'description': 'A novel about a young Andalusian shepherd on a journey to Egypt.',
                'isbn': '9780062315007',
                'genre': 'Adventure',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'
            },
            {
                'title': 'The Little Prince',
                'author': 'Antoine de Saint-Exupéry',
                'description': 'A poetic tale about a young prince who visits various planets in space.',
                'isbn': '9780156012195',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg'
            },
            {
                'title': 'Catch-22',
                'author': 'Joseph Heller',
                'description': 'A satirical novel set during World War II about circular logic and bureaucracy.',
                'isbn': '9781451626650',
                'genre': 'Satire',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781451626650-L.jpg'
            },
            {
                'title': 'Slaughterhouse-Five',
                'author': 'Kurt Vonnegut',
                'description': 'A science fiction-infused anti-war novel about Billy Pilgrim and the bombing of Dresden.',
                'isbn': '9780385333849',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780385333849-L.jpg'
            },
            {
                'title': 'The Handmaid\'s Tale',
                'author': 'Margaret Atwood',
                'description': 'A dystopian novel about a totalitarian society where women have no rights.',
                'isbn': '9780385490818',
                'genre': 'Dystopian Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg'
            },
            {
                'title': 'The Road',
                'author': 'Cormac McCarthy',
                'description': 'A post-apocalyptic novel about a father and son\'s journey through a devastated America.',
                'isbn': '9780307387899',
                'genre': 'Post-Apocalyptic',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg'
            },
            {
                'title': 'Life of Pi',
                'author': 'Yann Martel',
                'description': 'A fantasy adventure novel about an Indian boy surviving a shipwreck with a Bengal tiger.',
                'isbn': '9780156027328',
                'genre': 'Adventure',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg'
            },
            {
                'title': 'The Kite Runner',
                'author': 'Khaled Hosseini',
                'description': 'A novel about friendship and redemption set in Afghanistan.',
                'isbn': '9781594631931',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg'
            },
            {
                'title': 'The Book Thief',
                'author': 'Markus Zusak',
                'description': 'A historical novel narrated by Death about a girl living in Nazi Germany.',
                'isbn': '9780375842207',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg'
            },
            {
                'title': 'The Hunger Games',
                'author': 'Suzanne Collins',
                'description': 'A dystopian novel about a televised fight to the death among teenagers.',
                'isbn': '9780439023481',
                'genre': 'Dystopian Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg'
            },
            {
                'title': 'The Da Vinci Code',
                'author': 'Dan Brown',
                'description': 'A mystery thriller following symbologist Robert Langdon.',
                'isbn': '9780385504201',
                'genre': 'Mystery Thriller',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780385504201-L.jpg'
            },
            {
                'title': 'The Girl with the Dragon Tattoo',
                'author': 'Stieg Larsson',
                'description': 'A psychological thriller about a journalist and a hacker investigating a disappearance.',
                'isbn': '9780307454546',
                'genre': 'Mystery Thriller',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg'
            },
            {
                'title': 'Gone Girl',
                'author': 'Gillian Flynn',
                'description': 'A psychological thriller about a woman who disappears on her fifth wedding anniversary.',
                'isbn': '9780307588371',
                'genre': 'Mystery Thriller',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg'
            },
            {
                'title': 'The Fault in Our Stars',
                'author': 'John Green',
                'description': 'A novel about two teenagers with cancer who fall in love.',
                'isbn': '9780525478812',
                'genre': 'Young Adult',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg'
            },
            {
                'title': 'The Martian',
                'author': 'Andy Weir',
                'description': 'A science fiction novel about an astronaut stranded on Mars.',
                'isbn': '9780553418026',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780553418026-L.jpg'
            },
            {
                'title': 'Ready Player One',
                'author': 'Ernest Cline',
                'description': 'A science fiction novel set in a dystopian future dominated by virtual reality.',
                'isbn': '9780307887436',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307887436-L.jpg'
            },
            {
                'title': 'The Shining',
                'author': 'Stephen King',
                'description': 'A horror novel about a family trapped in an isolated hotel during winter.',
                'isbn': '9780307743657',
                'genre': 'Horror',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg'
            },
            {
                'title': 'It',
                'author': 'Stephen King',
                'description': 'A horror novel about a group of children terrorized by a shape-shifting entity.',
                'isbn': '9781501142970',
                'genre': 'Horror',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg'
            },
            {
                'title': 'Dune',
                'author': 'Frank Herbert',
                'description': 'A science fiction novel set on the desert planet Arrakis.',
                'isbn': '9780441172719',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg'
            },
            {
                'title': 'Foundation',
                'author': 'Isaac Asimov',
                'description': 'A science fiction novel about the fall and rise of galactic civilizations.',
                'isbn': '9780553293357',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg'
            },
            {
                'title': 'Neuromancer',
                'author': 'William Gibson',
                'description': 'A cyberpunk novel about a washed-up computer hacker hired for one last job.',
                'isbn': '9780441569595',
                'genre': 'Cyberpunk',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg'
            },
            {
                'title': 'Sapiens: A Brief History of Humankind',
                'author': 'Yuval Noah Harari',
                'description': 'A groundbreaking narrative of humanity\'s creation and evolution.',
                'isbn': '9780062316097',
                'genre': 'Non-Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg'
            },
        ]

        # Create books
        created_count = 0
        for book_data in books_data:
            Book.objects.create(
                user=user,
                **book_data
            )
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} books'))
        self.stdout.write(self.style.SUCCESS(f'All books assigned to user: {user.username}'))
