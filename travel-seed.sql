-- both test users have the password "password"

INSERT INTO users (username, role, password, first_name, last_name, email, deleted )
VALUES ('testuser', 'user',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test', 'user', 'lol@lol.comp', FALSE),
        ('testpartner', 'partner',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test', 'user', 'lol@lol.comp', FALSE);



INSERT INTO carts (c_username)
VALUES ('testuser');

INSERT INTO trips (destination, partnername,check_in, check_out, all_inclusive,  price_per_person, image_url, t_deleted)
VALUES ('zopa', 'testpartner', '06-10-2022', '06-20-2022', TRUE, 100, 'https://cdn.britannica.com/15/162615-131-0CBB2CBE/island-Caribbean.jpg', FALSE),
('tver', 'testpartner','05-10-2022', '05-20-2022', TRUE,100, 'https://www.worldatlas.com/r/w1200/upload/c1/a3/0c/shutterstock-383289268.jpg', FALSE),
('ostrov', 'testpartner','06-20-2022', '06-30-2022', TRUE, 100, 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F642794476%2FYoung-woman-sunbathing-on-private-island%2F960x0.jpg%3FcropX1%3D1449%26cropX2%3D4127%26cropY1%3D679%26cropY2%3D2185', FALSE),
('griazi', 'testpartner','07-20-2022', '07-30-2022', TRUE, 100, 'https://www.planetware.com/wpimages/2020/04/caribbean-best-time-to-visit-best-time-to-travel.jpg', TRUE);






        