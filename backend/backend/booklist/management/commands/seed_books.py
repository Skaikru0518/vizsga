from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from booklist.models import Book
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with 100+ real books including Twin Peaks novels'

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
            {
                'title': 'The Hitchhiker\'s Guide to the Galaxy',
                'author': 'Douglas Adams',
                'description': 'A comic science fiction series about the adventures of Arthur Dent.',
                'isbn': '9780345391803',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg'
            },
            {
                'title': 'A Game of Thrones',
                'author': 'George R.R. Martin',
                'description': 'The first novel in an epic fantasy series about power struggles in Westeros.',
                'isbn': '9780553103540',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg'
            },
            {
                'title': 'The Name of the Wind',
                'author': 'Patrick Rothfuss',
                'description': 'A fantasy novel about Kvothe, a legendary figure telling his own story.',
                'isbn': '9780756404079',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780756404079-L.jpg'
            },
            {
                'title': 'The Stand',
                'author': 'Stephen King',
                'description': 'A post-apocalyptic horror novel about a pandemic and the survivors.',
                'isbn': '9780307743688',
                'genre': 'Horror',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307743688-L.jpg'
            },
            {
                'title': 'Ender\'s Game',
                'author': 'Orson Scott Card',
                'description': 'A military science fiction novel about a young genius trained to fight aliens.',
                'isbn': '9780812550702',
                'genre': 'Science Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg'
            },
            {
                'title': 'The Silmarillion',
                'author': 'J.R.R. Tolkien',
                'description': 'A collection of mythopoeic stories about the history of Middle-earth.',
                'isbn': '9780618391110',
                'genre': 'Fantasy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780618391110-L.jpg'
            },
            {
                'title': 'Educated',
                'author': 'Tara Westover',
                'description': 'A memoir about a woman who grows up in a survivalist family and escapes to learn.',
                'isbn': '9780399590504',
                'genre': 'Memoir',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg'
            },
            {
                'title': 'Becoming',
                'author': 'Michelle Obama',
                'description': 'A memoir by the former First Lady of the United States.',
                'isbn': '9781524763138',
                'genre': 'Memoir',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg'
            },
            {
                'title': 'The 7 Habits of Highly Effective People',
                'author': 'Stephen R. Covey',
                'description': 'A self-help book about achieving personal and professional effectiveness.',
                'isbn': '9781982137274',
                'genre': 'Self-Help',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781982137274-L.jpg'
            },
            {
                'title': 'Atomic Habits',
                'author': 'James Clear',
                'description': 'A practical guide to building good habits and breaking bad ones.',
                'isbn': '9780735211292',
                'genre': 'Self-Help',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
            },
            {
                'title': 'The Power of Now',
                'author': 'Eckhart Tolle',
                'description': 'A guide to spiritual enlightenment focused on living in the present moment.',
                'isbn': '9781577314806',
                'genre': 'Spirituality',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg'
            },
            {
                'title': 'Thinking, Fast and Slow',
                'author': 'Daniel Kahneman',
                'description': 'A book about the two systems that drive the way we think.',
                'isbn': '9780374533557',
                'genre': 'Psychology',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg'
            },
            {
                'title': 'The Subtle Art of Not Giving a F*ck',
                'author': 'Mark Manson',
                'description': 'A counterintuitive approach to living a good life.',
                'isbn': '9780062457714',
                'genre': 'Self-Help',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg'
            },
            {
                'title': 'Man\'s Search for Meaning',
                'author': 'Viktor E. Frankl',
                'description': 'A memoir about surviving the Holocaust and finding purpose in life.',
                'isbn': '9780807014295',
                'genre': 'Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780807014295-L.jpg'
            },
            {
                'title': 'The Lean Startup',
                'author': 'Eric Ries',
                'description': 'A methodology for developing businesses and products.',
                'isbn': '9780307887894',
                'genre': 'Business',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg'
            },
            {
                'title': 'Zero to One',
                'author': 'Peter Thiel',
                'description': 'Notes on startups and how to build the future.',
                'isbn': '9780804139298',
                'genre': 'Business',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg'
            },
            {
                'title': 'The Immortal Life of Henrietta Lacks',
                'author': 'Rebecca Skloot',
                'description': 'The story of a woman whose cells revolutionized medicine.',
                'isbn': '9781400052189',
                'genre': 'Non-Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781400052189-L.jpg'
            },
            {
                'title': 'Into the Wild',
                'author': 'Jon Krakauer',
                'description': 'The story of Christopher McCandless\'s journey into the Alaskan wilderness.',
                'isbn': '9780385486804',
                'genre': 'Biography',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780385486804-L.jpg'
            },
            {
                'title': 'The Glass Castle',
                'author': 'Jeannette Walls',
                'description': 'A memoir about growing up in a dysfunctional family.',
                'isbn': '9780743247542',
                'genre': 'Memoir',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780743247542-L.jpg'
            },
            {
                'title': 'Born a Crime',
                'author': 'Trevor Noah',
                'description': 'A memoir about growing up in South Africa during and after apartheid.',
                'isbn': '9780399588174',
                'genre': 'Memoir',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780399588174-L.jpg'
            },
            {
                'title': 'The Gene: An Intimate History',
                'author': 'Siddhartha Mukherjee',
                'description': 'A history of genetics and its impact on humanity.',
                'isbn': '9781476733500',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781476733500-L.jpg'
            },
            {
                'title': 'A Brief History of Time',
                'author': 'Stephen Hawking',
                'description': 'A landmark volume in science writing about cosmology.',
                'isbn': '9780553380163',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg'
            },
            {
                'title': 'The Sixth Extinction',
                'author': 'Elizabeth Kolbert',
                'description': 'An examination of the current mass extinction event.',
                'isbn': '9781250062185',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781250062185-L.jpg'
            },
            {
                'title': 'Guns, Germs, and Steel',
                'author': 'Jared Diamond',
                'description': 'A book about the fates of human societies and environmental factors.',
                'isbn': '9780393317558',
                'genre': 'Anthropology',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg'
            },
            {
                'title': 'The Emperor of All Maladies',
                'author': 'Siddhartha Mukherjee',
                'description': 'A biography of cancer and the fight against it.',
                'isbn': '9781439170915',
                'genre': 'Medical History',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781439170915-L.jpg'
            },
            {
                'title': 'Quiet: The Power of Introverts',
                'author': 'Susan Cain',
                'description': 'A book about the power of introverts in a world that can\'t stop talking.',
                'isbn': '9780307352156',
                'genre': 'Psychology',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780307352156-L.jpg'
            },
            {
                'title': 'Outliers',
                'author': 'Malcolm Gladwell',
                'description': 'A book about what makes high-achievers different.',
                'isbn': '9780316017930',
                'genre': 'Psychology',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg'
            },
            {
                'title': 'The Tipping Point',
                'author': 'Malcolm Gladwell',
                'description': 'How little things can make a big difference.',
                'isbn': '9780316346627',
                'genre': 'Sociology',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780316346627-L.jpg'
            },
            {
                'title': 'Freakonomics',
                'author': 'Steven D. Levitt',
                'description': 'A rogue economist explores the hidden side of everything.',
                'isbn': '9780060731328',
                'genre': 'Economics',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780060731328-L.jpg'
            },
            {
                'title': 'The Art of War',
                'author': 'Sun Tzu',
                'description': 'An ancient Chinese military treatise on strategy and tactics.',
                'isbn': '9781599869773',
                'genre': 'Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781599869773-L.jpg'
            },
            {
                'title': 'Meditations',
                'author': 'Marcus Aurelius',
                'description': 'Personal writings by the Roman Emperor on Stoic philosophy.',
                'isbn': '9780812968255',
                'genre': 'Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg'
            },
            {
                'title': 'The Republic',
                'author': 'Plato',
                'description': 'A Socratic dialogue concerning justice and the order of the city-state.',
                'isbn': '9780140449143',
                'genre': 'Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780140449143-L.jpg'
            },
            {
                'title': 'The Prince',
                'author': 'Niccolò Machiavelli',
                'description': 'A political treatise on leadership and power.',
                'isbn': '9780140449150',
                'genre': 'Political Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780140449150-L.jpg'
            },
            {
                'title': 'The Communist Manifesto',
                'author': 'Karl Marx',
                'description': 'A political pamphlet advocating for class struggle.',
                'isbn': '9780140447576',
                'genre': 'Political Philosophy',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780140447576-L.jpg'
            },
            {
                'title': 'On the Origin of Species',
                'author': 'Charles Darwin',
                'description': 'The foundational work of evolutionary biology.',
                'isbn': '9780140439120',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780140439120-L.jpg'
            },
            {
                'title': 'The Selfish Gene',
                'author': 'Richard Dawkins',
                'description': 'A gene-centered view of evolution.',
                'isbn': '9780199291151',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780199291151-L.jpg'
            },
            {
                'title': 'Cosmos',
                'author': 'Carl Sagan',
                'description': 'A journey through space and time exploring the universe.',
                'isbn': '9780345539434',
                'genre': 'Science',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg'
            },
            {
                'title': 'The Diary of a Young Girl',
                'author': 'Anne Frank',
                'description': 'The diary of a Jewish girl hiding during the Holocaust.',
                'isbn': '9780553296983',
                'genre': 'Biography',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg'
            },
            {
                'title': 'Night',
                'author': 'Elie Wiesel',
                'description': 'A memoir of experiences in Nazi concentration camps.',
                'isbn': '9780374500016',
                'genre': 'Memoir',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780374500016-L.jpg'
            },
            {
                'title': 'The Color Purple',
                'author': 'Alice Walker',
                'description': 'An epistolary novel about an African-American woman in the South.',
                'isbn': '9780156028356',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780156028356-L.jpg'
            },
            {
                'title': 'Beloved',
                'author': 'Toni Morrison',
                'description': 'A novel about the legacy of slavery.',
                'isbn': '9781400033416',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg'
            },
            {
                'title': 'The Grapes of Wrath',
                'author': 'John Steinbeck',
                'description': 'A novel about a family during the Great Depression.',
                'isbn': '9780143039433',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780143039433-L.jpg'
            },
            {
                'title': 'Of Mice and Men',
                'author': 'John Steinbeck',
                'description': 'A novella about two displaced migrant workers during the Great Depression.',
                'isbn': '9780142000670',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780142000670-L.jpg'
            },
            {
                'title': 'The Sun Also Rises',
                'author': 'Ernest Hemingway',
                'description': 'A novel about American and British expatriates in Europe.',
                'isbn': '9780743297332',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780743297332-L.jpg'
            },
            {
                'title': 'For Whom the Bell Tolls',
                'author': 'Ernest Hemingway',
                'description': 'A novel about an American fighting in the Spanish Civil War.',
                'isbn': '9780684803357',
                'genre': 'Historical Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780684803357-L.jpg'
            },
            {
                'title': 'A Farewell to Arms',
                'author': 'Ernest Hemingway',
                'description': 'A novel about an American ambulance driver during World War I.',
                'isbn': '9780684801469',
                'genre': 'War Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780684801469-L.jpg'
            },
            {
                'title': 'The Old Man and the Sea',
                'author': 'Ernest Hemingway',
                'description': 'A short novel about an aging fisherman\'s epic battle with a giant marlin.',
                'isbn': '9780684801223',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780684801223-L.jpg'
            },
            {
                'title': 'The Sound and the Fury',
                'author': 'William Faulkner',
                'description': 'A novel about the decline of a Southern aristocratic family.',
                'isbn': '9780679732242',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780679732242-L.jpg'
            },
            {
                'title': 'As I Lay Dying',
                'author': 'William Faulkner',
                'description': 'A novel about a family\'s journey to bury their matriarch.',
                'isbn': '9780679732259',
                'genre': 'Classic Fiction',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780679732259-L.jpg'
            },
            {
                'title': 'Twin Peaks: The Final Dossier',
                'author': 'Mark Frost',
                'description': 'A novel expanding the Twin Peaks universe with FBI files and character backgrounds.',
                'isbn': '9781250163301',
                'genre': 'Mystery',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781250163301-L.jpg'
            },
            {
                'title': 'The Secret History of Twin Peaks',
                'author': 'Mark Frost',
                'description': 'An epistolary novel revealing the secret history of Twin Peaks.',
                'isbn': '9781250075567',
                'genre': 'Mystery',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9781250075567-L.jpg'
            },
            {
                'title': 'The Autobiography of F.B.I. Special Agent Dale Cooper',
                'author': 'Scott Frost',
                'description': 'The life story of Twin Peaks\' FBI agent Dale Cooper.',
                'isbn': '9780671736880',
                'genre': 'Mystery',
                'coverUrl': 'https://covers.openlibrary.org/b/isbn/9780671736880-L.jpg'
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
