--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Homebrew)
-- Dumped by pg_dump version 16.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: ContentBlock; Type: TABLE DATA; Schema: public; Owner: eric
--

INSERT INTO public."ContentBlock" VALUES (1, 'section1', '{"tagline": "當代設計", "leftImage": "/Mask group.png", "titleLeft": "Contemporary", "rightImage": "/Mask group2.png", "titleRight": "Design", "bottomTitle": "做出120%的作品非常不容易", "rightTopText": "we create the onysica presence your identity deserves.", "rightTopTagline": "我的風格，由我來定義", "bottomDescription": "剝除多餘的裝飾\n創造永不退流行的設計空間"}', '2025-11-25 11:14:15.374', '2025-11-25 11:14:15.374');
INSERT INTO public."ContentBlock" VALUES (2, 'section7', '{"title": "立足台灣\n放眼全球", "images": [{"src": "/Mask group4.png", "position": "left"}, {"src": "/Mask group.png", "position": "rightTop"}, {"src": "/Mask group2.png", "position": "rightBottom"}], "regions": [{"name": "台北", "type": "rectangle"}, {"name": "台中", "type": "circle"}, {"name": "海外", "type": "rectangle"}], "description": "從台北到台中，我們在台灣深耕多年，為在地客戶打造獨一無二的當代設計空間。\n\n同時，我們的服務觸角延伸至海外，將台灣的設計美學帶向國際舞台，讓世界看見東方當代設計的獨特魅力。"}', '2025-11-25 11:16:45.13', '2025-11-25 11:16:45.13');
INSERT INTO public."ContentBlock" VALUES (3, 'section6', '{"faqs": [{"answer": "對我來說，當代設計不是一種風格，而是一種態度。\n它關注當下的生活方式、材質的真實性與環境的回應。", "question": "你怎麼定義「當代設計」？"}], "title": "QA", "leftDescription": "線條簡潔、比例純粹\n當代住宅不唯噩於形\n而讓空間自己說話\n\n少一分裝飾，多一分真實"}', '2025-11-25 11:16:53.509', '2025-11-25 11:16:53.509');
INSERT INTO public."ContentBlock" VALUES (4, 'section2', '{"title": "團隊成員", "members": [{"id": 1, "name": "李珈儀 Vivian", "role": "合夥人 / 行銷總監", "avatar": "/IMG_9001.jpg", "contact": {"email": "chen@archspace.tw", "phone": "+886 2 2345 6789", "linkedin": "chen-yisen"}, "experience": ["塑造全球品牌形象，讓創意與客戶需求緊密結合", "透過市場洞察與批判思考，驅動品牌系統化成長", "跨領域合作", "管理數位內容策略與績效追蹤，優化行銷成效"], "description": "執行專案：HBO Max、MEDIX ProClot、INSPO、AZUCAR、瀚寓酒店、娘家益生菌等", "yearsExperience": "18+"}], "subtitle": "Team Members"}', '2025-11-25 11:16:53.509', '2025-11-25 11:16:53.509');
INSERT INTO public."ContentBlock" VALUES (5, 'section4', '{"label": "CLIENT TESTIMONIALS", "ctaLink": "#", "ctaText": "查看更多客戶回饋", "testimonials": [{"image": "/Mask group4.png", "title": "我的咖啡廳，風格由我來定義！", "description": "咖啡不止要好喝，更要脫穎而出..."}]}', '2025-11-25 11:27:36.326', '2025-11-25 11:27:36.326');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: eric
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: eric
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: eric
--



--
-- Data for Name: ip_blocklist; Type: TABLE DATA; Schema: public; Owner: eric
--

INSERT INTO public.ip_blocklist VALUES (1, 'dev-pnrg3a-4924', 1, NULL, '2025-11-25 11:27:24.925', '2025-11-25 11:27:24.925');


--
-- Name: ContentBlock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eric
--

SELECT pg_catalog.setval('public."ContentBlock_id_seq"', 5, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eric
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eric
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: ip_blocklist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eric
--

SELECT pg_catalog.setval('public.ip_blocklist_id_seq', 1, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eric
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

