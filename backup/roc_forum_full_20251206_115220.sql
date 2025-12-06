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

ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS "posts_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_postId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_parentId_fkey";
DROP INDEX IF EXISTS public.posts_slug_key;
DROP INDEX IF EXISTS public.posts_slug_idx;
DROP INDEX IF EXISTS public."posts_categoryId_idx";
DROP INDEX IF EXISTS public."ip_blocklist_ipAddress_key";
DROP INDEX IF EXISTS public."comments_postId_idx";
DROP INDEX IF EXISTS public."comments_parentId_idx";
DROP INDEX IF EXISTS public.categories_slug_key;
DROP INDEX IF EXISTS public.categories_name_key;
DROP INDEX IF EXISTS public."ContentBlock_key_key";
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS ONLY public.ip_blocklist DROP CONSTRAINT IF EXISTS ip_blocklist_pkey;
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS comments_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public."ContentBlock" DROP CONSTRAINT IF EXISTS "ContentBlock_pkey";
ALTER TABLE IF EXISTS public.posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ip_blocklist ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.comments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."ContentBlock" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.posts_id_seq;
DROP TABLE IF EXISTS public.posts;
DROP SEQUENCE IF EXISTS public.ip_blocklist_id_seq;
DROP TABLE IF EXISTS public.ip_blocklist;
DROP SEQUENCE IF EXISTS public.comments_id_seq;
DROP TABLE IF EXISTS public.comments;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public."ContentBlock_id_seq";
DROP TABLE IF EXISTS public."ContentBlock";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ContentBlock; Type: TABLE; Schema: public; Owner: eric
--

CREATE TABLE public."ContentBlock" (
    id integer NOT NULL,
    key text NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ContentBlock" OWNER TO eric;

--
-- Name: ContentBlock_id_seq; Type: SEQUENCE; Schema: public; Owner: eric
--

CREATE SEQUENCE public."ContentBlock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ContentBlock_id_seq" OWNER TO eric;

--
-- Name: ContentBlock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eric
--

ALTER SEQUENCE public."ContentBlock_id_seq" OWNED BY public."ContentBlock".id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: eric
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    color text DEFAULT '#1d2088'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO eric;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: eric
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO eric;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eric
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: eric
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content text NOT NULL,
    author text NOT NULL,
    "authorEmail" text,
    "postId" integer NOT NULL,
    "parentId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO eric;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: eric
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO eric;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eric
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: ip_blocklist; Type: TABLE; Schema: public; Owner: eric
--

CREATE TABLE public.ip_blocklist (
    id integer NOT NULL,
    "ipAddress" text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "blockedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ip_blocklist OWNER TO eric;

--
-- Name: ip_blocklist_id_seq; Type: SEQUENCE; Schema: public; Owner: eric
--

CREATE SEQUENCE public.ip_blocklist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_blocklist_id_seq OWNER TO eric;

--
-- Name: ip_blocklist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eric
--

ALTER SEQUENCE public.ip_blocklist_id_seq OWNED BY public.ip_blocklist.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: eric
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    author text NOT NULL,
    "authorEmail" text,
    "coverImage" text,
    views integer DEFAULT 0 NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.posts OWNER TO eric;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: eric
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO eric;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eric
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: ContentBlock id; Type: DEFAULT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public."ContentBlock" ALTER COLUMN id SET DEFAULT nextval('public."ContentBlock_id_seq"'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: ip_blocklist id; Type: DEFAULT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.ip_blocklist ALTER COLUMN id SET DEFAULT nextval('public.ip_blocklist_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Data for Name: ContentBlock; Type: TABLE DATA; Schema: public; Owner: eric
--

COPY public."ContentBlock" (id, key, payload, "createdAt", "updatedAt") FROM stdin;
1	section1	{"tagline": "當代設計", "leftImage": "/Mask group.png", "titleLeft": "Contemporary", "rightImage": "/Mask group2.png", "titleRight": "Design", "bottomTitle": "做出120%的作品非常不容易", "rightTopText": "we create the onysica presence your identity deserves.", "rightTopTagline": "我的風格，由我來定義", "bottomDescription": "剝除多餘的裝飾\\n創造永不退流行的設計空間"}	2025-11-25 11:14:15.374	2025-11-25 11:14:15.374
2	section7	{"title": "立足台灣\\n放眼全球", "images": [{"src": "/Mask group4.png", "position": "left"}, {"src": "/Mask group.png", "position": "rightTop"}, {"src": "/Mask group2.png", "position": "rightBottom"}], "regions": [{"name": "台北", "type": "rectangle"}, {"name": "台中", "type": "circle"}, {"name": "海外", "type": "rectangle"}], "description": "從台北到台中，我們在台灣深耕多年，為在地客戶打造獨一無二的當代設計空間。\\n\\n同時，我們的服務觸角延伸至海外，將台灣的設計美學帶向國際舞台，讓世界看見東方當代設計的獨特魅力。"}	2025-11-25 11:16:45.13	2025-11-25 11:16:45.13
3	section6	{"faqs": [{"answer": "對我來說，當代設計不是一種風格，而是一種態度。\\n它關注當下的生活方式、材質的真實性與環境的回應。", "question": "你怎麼定義「當代設計」？"}], "title": "QA", "leftDescription": "線條簡潔、比例純粹\\n當代住宅不唯噩於形\\n而讓空間自己說話\\n\\n少一分裝飾，多一分真實"}	2025-11-25 11:16:53.509	2025-11-25 11:16:53.509
4	section2	{"title": "團隊成員", "members": [{"id": 1, "name": "李珈儀 Vivian", "role": "合夥人 / 行銷總監", "avatar": "/IMG_9001.jpg", "contact": {"email": "chen@archspace.tw", "phone": "+886 2 2345 6789", "linkedin": "chen-yisen"}, "experience": ["塑造全球品牌形象，讓創意與客戶需求緊密結合", "透過市場洞察與批判思考，驅動品牌系統化成長", "跨領域合作", "管理數位內容策略與績效追蹤，優化行銷成效"], "description": "執行專案：HBO Max、MEDIX ProClot、INSPO、AZUCAR、瀚寓酒店、娘家益生菌等", "yearsExperience": "18+"}], "subtitle": "Team Members"}	2025-11-25 11:16:53.509	2025-11-25 11:16:53.509
5	section4	{"label": "CLIENT TESTIMONIALS", "ctaLink": "#", "ctaText": "查看更多客戶回饋", "testimonials": [{"image": "/Mask group4.png", "title": "我的咖啡廳，風格由我來定義！", "description": "咖啡不止要好喝，更要脫穎而出..."}]}	2025-11-25 11:27:36.326	2025-11-25 11:27:36.326
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: eric
--

COPY public.categories (id, name, slug, description, icon, color, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: eric
--

COPY public.comments (id, content, author, "authorEmail", "postId", "parentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ip_blocklist; Type: TABLE DATA; Schema: public; Owner: eric
--

COPY public.ip_blocklist (id, "ipAddress", attempts, "blockedAt", "createdAt", "updatedAt") FROM stdin;
1	dev-pnrg3a-4924	1	\N	2025-11-25 11:27:24.925	2025-11-25 11:27:24.925
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: eric
--

COPY public.posts (id, title, slug, content, excerpt, author, "authorEmail", "coverImage", views, "isPinned", "isLocked", "categoryId", "createdAt", "updatedAt") FROM stdin;
\.


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
-- Name: ContentBlock ContentBlock_pkey; Type: CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public."ContentBlock"
    ADD CONSTRAINT "ContentBlock_pkey" PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: ip_blocklist ip_blocklist_pkey; Type: CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.ip_blocklist
    ADD CONSTRAINT ip_blocklist_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: ContentBlock_key_key; Type: INDEX; Schema: public; Owner: eric
--

CREATE UNIQUE INDEX "ContentBlock_key_key" ON public."ContentBlock" USING btree (key);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: eric
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: eric
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: comments_parentId_idx; Type: INDEX; Schema: public; Owner: eric
--

CREATE INDEX "comments_parentId_idx" ON public.comments USING btree ("parentId");


--
-- Name: comments_postId_idx; Type: INDEX; Schema: public; Owner: eric
--

CREATE INDEX "comments_postId_idx" ON public.comments USING btree ("postId");


--
-- Name: ip_blocklist_ipAddress_key; Type: INDEX; Schema: public; Owner: eric
--

CREATE UNIQUE INDEX "ip_blocklist_ipAddress_key" ON public.ip_blocklist USING btree ("ipAddress");


--
-- Name: posts_categoryId_idx; Type: INDEX; Schema: public; Owner: eric
--

CREATE INDEX "posts_categoryId_idx" ON public.posts USING btree ("categoryId");


--
-- Name: posts_slug_idx; Type: INDEX; Schema: public; Owner: eric
--

CREATE INDEX posts_slug_idx ON public.posts USING btree (slug);


--
-- Name: posts_slug_key; Type: INDEX; Schema: public; Owner: eric
--

CREATE UNIQUE INDEX posts_slug_key ON public.posts USING btree (slug);


--
-- Name: comments comments_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eric
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

