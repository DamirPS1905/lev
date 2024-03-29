--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: catalog_types_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_types_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;
INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES(NEW.parent, NEW.id, 1);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_types_after_insert_fnc() OWNER TO dev;

--
-- Name: catalog_types_after_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_types_after_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
DELETE FROM public.catalog_types_overload AS o
USING public.catalog_types_overload AS och,
public.catalog_types_overload AS opr 
WHERE och.child=o.child AND opr.parent=o.parent
AND och.parent=OLD.id AND opr.child=OLD.id;

DELETE FROM public.catalog_types_overload AS o
WHERE o.child=OLD.id;

INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES(NEW.parent, NEW.id, 1);

INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;

INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT opr.parent, och.child, opr.delta+och.delta
FROM public.catalog_types_overload AS och
INNER JOIN public.catalog_types_overload AS opr ON TRUE
WHERE och.parent=NEW.id AND opr.child=NEW.id;

RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_types_after_update_fnc() OWNER TO dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actor_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.actor_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.actor_types OWNER TO dev;

--
-- Name: actor_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.actor_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actor_types_id_seq OWNER TO dev;

--
-- Name: actor_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.actor_types_id_seq OWNED BY public.actor_types.id;


--
-- Name: actors; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.actors (
    id integer NOT NULL,
    type integer NOT NULL,
    key integer
);


ALTER TABLE public.actors OWNER TO dev;

--
-- Name: actors_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.actors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actors_id_seq OWNER TO dev;

--
-- Name: actors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.actors_id_seq OWNED BY public.actors.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    key character varying NOT NULL,
    company integer NOT NULL,
    disposed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    disposed_at timestamp with time zone,
    actor integer NOT NULL
);


ALTER TABLE public.api_keys OWNER TO dev;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_id_seq OWNER TO dev;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: catalog_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_types (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    parent integer,
    root boolean DEFAULT false NOT NULL,
    level smallint NOT NULL
);


ALTER TABLE public.catalog_types OWNER TO dev;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO dev;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.catalog_types.id;


--
-- Name: catalog_brands; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_brands (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    description text,
    logo character varying
);


ALTER TABLE public.catalog_brands OWNER TO dev;

--
-- Name: catalog_brands_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_brands_id_seq OWNER TO dev;

--
-- Name: catalog_brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_brands_id_seq OWNED BY public.catalog_brands.id;


--
-- Name: catalog_product_offers; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_product_offers (
    id bigint NOT NULL,
    product bigint NOT NULL,
    catalog integer NOT NULL,
    article character varying NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.catalog_product_offers OWNER TO dev;

--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_product_offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_product_offers_id_seq OWNER TO dev;

--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_product_offers_id_seq OWNED BY public.catalog_product_offers.id;


--
-- Name: catalog_products; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_products (
    id bigint NOT NULL,
    catalog integer NOT NULL,
    type integer NOT NULL,
    brand integer NOT NULL,
    title character varying NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.catalog_products OWNER TO dev;

--
-- Name: catalog_products_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_products_id_seq OWNER TO dev;

--
-- Name: catalog_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_products_id_seq OWNED BY public.catalog_products.id;


--
-- Name: catalog_properties; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_properties (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    type integer NOT NULL,
    multiple boolean DEFAULT false NOT NULL,
    options boolean DEFAULT false NOT NULL
);


ALTER TABLE public.catalog_properties OWNER TO dev;

--
-- Name: catalog_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_properties_id_seq OWNER TO dev;

--
-- Name: catalog_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_properties_id_seq OWNED BY public.catalog_properties.id;


--
-- Name: catalog_types_overload; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_types_overload (
    parent integer NOT NULL,
    child integer NOT NULL,
    delta smallint NOT NULL
);


ALTER TABLE public.catalog_types_overload OWNER TO dev;

--
-- Name: catalogs; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalogs (
    id integer NOT NULL,
    title character varying NOT NULL,
    company integer NOT NULL
);


ALTER TABLE public.catalogs OWNER TO dev;

--
-- Name: catalogs_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogs_id_seq OWNER TO dev;

--
-- Name: catalogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalogs_id_seq OWNED BY public.catalogs.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.companies OWNER TO dev;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO dev;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: offer_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_property_values (
    offer bigint NOT NULL,
    property integer NOT NULL,
    value jsonb NOT NULL
);


ALTER TABLE public.offer_property_values OWNER TO dev;

--
-- Name: options_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.options_property_values (
    id integer NOT NULL,
    property integer NOT NULL,
    value jsonb NOT NULL,
    hash character varying(48)
);


ALTER TABLE public.options_property_values OWNER TO dev;

--
-- Name: options_property_values_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.options_property_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.options_property_values_id_seq OWNER TO dev;

--
-- Name: options_property_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.options_property_values_id_seq OWNED BY public.options_property_values.id;


--
-- Name: product_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_property_values (
    product bigint NOT NULL,
    property integer NOT NULL,
    value jsonb NOT NULL
);


ALTER TABLE public.product_property_values OWNER TO dev;

--
-- Name: property_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.property_types (
    id integer NOT NULL,
    title character varying NOT NULL,
    scheme json NOT NULL,
    catalog integer
);


ALTER TABLE public.property_types OWNER TO dev;

--
-- Name: property_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.property_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_types_id_seq OWNER TO dev;

--
-- Name: property_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.property_types_id_seq OWNED BY public.property_types.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying NOT NULL,
    pwd_hash character varying NOT NULL,
    actor integer NOT NULL,
    created timestamp with time zone NOT NULL,
    company integer NOT NULL
);


ALTER TABLE public.users OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: actor_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types ALTER COLUMN id SET DEFAULT nextval('public.actor_types_id_seq'::regclass);


--
-- Name: actors id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors ALTER COLUMN id SET DEFAULT nextval('public.actors_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: catalog_brands id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands ALTER COLUMN id SET DEFAULT nextval('public.catalog_brands_id_seq'::regclass);


--
-- Name: catalog_product_offers id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers ALTER COLUMN id SET DEFAULT nextval('public.catalog_product_offers_id_seq'::regclass);


--
-- Name: catalog_products id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products ALTER COLUMN id SET DEFAULT nextval('public.catalog_products_id_seq'::regclass);


--
-- Name: catalog_properties id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties ALTER COLUMN id SET DEFAULT nextval('public.catalog_properties_id_seq'::regclass);


--
-- Name: catalog_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: catalogs id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs ALTER COLUMN id SET DEFAULT nextval('public.catalogs_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: options_property_values id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values ALTER COLUMN id SET DEFAULT nextval('public.options_property_values_id_seq'::regclass);


--
-- Name: property_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types ALTER COLUMN id SET DEFAULT nextval('public.property_types_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: actor_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.actor_types (id, title) FROM stdin;
1	User
2	Api key
3	Robot
\.


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.actors (id, type, key) FROM stdin;
1	2	4
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.api_keys (id, key, company, disposed, created_at, disposed_at, actor) FROM stdin;
4	123	1	f	2024-03-12 00:44:33.964296+03	\N	1
\.


--
-- Data for Name: catalog_brands; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_brands (id, catalog, title, description, logo) FROM stdin;
6	1	ikea348	\N	\N
3	1	ikea	iiiiii	\N
8	1	ikea348   	\N	\N
9	1	ikea348     	\N	\N
10	1	ikea348      	\N	\N
11	1	ikea348        	\N	\N
12	1	ik	\N	\N
13	1	  ikea	\N	\N
14	1	 ikea	\N	\N
15	1	     ikea	\N	\N
16	1	      ikea	\N	\N
17	1	         ikea	\N	\N
18	1	          ikea	\N	\N
19	1	zikea	\N	\N
20	1	ikega	\N	\N
21	1	ikehga	\N	\N
22	1	ikeffhga	\N	\N
\.


--
-- Data for Name: catalog_product_offers; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_product_offers (id, product, catalog, article, created) FROM stdin;
\.


--
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_products (id, catalog, type, brand, title, created) FROM stdin;
\.


--
-- Data for Name: catalog_properties; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_properties (id, catalog, title, type, multiple, options) FROM stdin;
\.


--
-- Data for Name: catalog_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types (id, catalog, title, parent, root, level) FROM stdin;
2	1	root-1	\N	t	0
8	1	t1	2	f	1
9	1	oooo	8	f	2
11	1	boots	2	f	1
\.


--
-- Data for Name: catalog_types_overload; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types_overload (parent, child, delta) FROM stdin;
2	8	1
8	9	1
2	9	2
2	11	1
\.


--
-- Data for Name: catalogs; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalogs (id, title, company) FROM stdin;
1	ololo	1
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.companies (id, title) FROM stdin;
1	test
\.


--
-- Data for Name: offer_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offer_property_values (offer, property, value) FROM stdin;
\.


--
-- Data for Name: options_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.options_property_values (id, property, value, hash) FROM stdin;
\.


--
-- Data for Name: product_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_property_values (product, property, value) FROM stdin;
\.


--
-- Data for Name: property_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_types (id, title, scheme, catalog) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users (id, login, pwd_hash, actor, created, company) FROM stdin;
\.


--
-- Name: actor_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.actor_types_id_seq', 4, true);


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.actors_id_seq', 1, true);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 4, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.brands_id_seq', 11, true);


--
-- Name: catalog_brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_brands_id_seq', 22, true);


--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_product_offers_id_seq', 1, false);


--
-- Name: catalog_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_products_id_seq', 1, false);


--
-- Name: catalog_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_properties_id_seq', 1, false);


--
-- Name: catalogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalogs_id_seq', 1, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, true);


--
-- Name: options_property_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.options_property_values_id_seq', 1, false);


--
-- Name: property_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_types_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: actor_types actor_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types
    ADD CONSTRAINT actor_types_pk PRIMARY KEY (id);


--
-- Name: actor_types actor_types_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types
    ADD CONSTRAINT actor_types_title_uind UNIQUE (title);


--
-- Name: actors actors_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pk PRIMARY KEY (id);


--
-- Name: actors actors_type_key_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_type_key_uind UNIQUE (type, key);


--
-- Name: api_keys api_keys_key_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_uind UNIQUE (key);


--
-- Name: api_keys api_keys_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pk PRIMARY KEY (id);


--
-- Name: catalog_brands catalog_brands_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_brands catalog_brands_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_pk PRIMARY KEY (id);


--
-- Name: catalog_product_offers catalog_product_offers_catalog_article_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalog_article_uind UNIQUE (catalog, article);


--
-- Name: catalog_product_offers catalog_product_offers_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_pk PRIMARY KEY (id);


--
-- Name: catalog_products catalog_products_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_products catalog_products_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_pk PRIMARY KEY (id);


--
-- Name: catalog_properties catalog_properties_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_properties catalog_properties_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_pk PRIMARY KEY (id);


--
-- Name: catalog_types_overload catalog_types_overload_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_pk PRIMARY KEY (parent, child);


--
-- Name: catalog_types catalog_types_parent_title; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_parent_title UNIQUE (parent, title);


--
-- Name: catalog_types catalog_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_pk PRIMARY KEY (id);


--
-- Name: catalogs catalogs_company_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_company_title_uind UNIQUE (company, title);


--
-- Name: catalogs catalogs_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_pk PRIMARY KEY (id);


--
-- Name: companies companies_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pk PRIMARY KEY (id);


--
-- Name: companies companies_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_title_uind UNIQUE (title);


--
-- Name: offer_property_values offer_property_values_offer_property_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_offer_property_uind PRIMARY KEY (offer, property);


--
-- Name: options_property_values options_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_pk PRIMARY KEY (id);


--
-- Name: options_property_values options_property_values_property_hash_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_property_hash_uind UNIQUE (property, hash);


--
-- Name: product_property_values product_property_values_product_property_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_product_property_uind PRIMARY KEY (product, property);


--
-- Name: property_types property_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_pk PRIMARY KEY (id);


--
-- Name: users users_login_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_uind UNIQUE (login);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: property_types_catalog_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_catalog_title_uind ON public.property_types USING btree (catalog, title) WHERE (catalog IS NOT NULL);


--
-- Name: property_types_common_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (catalog, title) WHERE (catalog IS NULL);


--
-- Name: catalog_types catalog_types_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_insert AFTER INSERT ON public.catalog_types FOR EACH ROW WHEN ((new.parent IS NOT NULL)) EXECUTE FUNCTION public.catalog_types_after_insert_fnc();


--
-- Name: catalog_types catalog_types_after_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_update AFTER UPDATE ON public.catalog_types FOR EACH ROW WHEN ((old.parent IS DISTINCT FROM new.parent)) EXECUTE FUNCTION public.catalog_types_after_update_fnc();


--
-- Name: actors actors_actor_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_actor_types_fk FOREIGN KEY (type) REFERENCES public.actor_types(id);


--
-- Name: api_keys api_keys_actors_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_actors_fk FOREIGN KEY (actor) REFERENCES public.actors(id);


--
-- Name: api_keys api_keys_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: catalog_brands catalog_brands_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_product_offers catalog_product_offers_catalog_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalog_products_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id);


--
-- Name: catalog_product_offers catalog_product_offers_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_products catalog_products_catalog_brands_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_brands_fk FOREIGN KEY (brand) REFERENCES public.catalog_brands(id);


--
-- Name: catalog_products catalog_products_catalog_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_types_fk FOREIGN KEY (type) REFERENCES public.catalog_types(id);


--
-- Name: catalog_products catalog_products_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_properties catalog_properties_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_properties catalog_properties_property_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_property_types_fk FOREIGN KEY (type) REFERENCES public.property_types(id);


--
-- Name: catalog_types catalog_types_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_types_overload catalog_types_overload_catalog_types_child_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_catalog_types_child_id_fk FOREIGN KEY (child) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


--
-- Name: catalog_types_overload catalog_types_overload_catalog_types_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_catalog_types_parent_id_fk FOREIGN KEY (parent) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


--
-- Name: catalog_types catalog_types_parent_id_req_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_parent_id_req_fk FOREIGN KEY (parent) REFERENCES public.catalog_types(id);


--
-- Name: catalogs catalogs_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: offer_property_values offer_property_values_catalog_product_offers_fk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_product_offers_fk_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offer_property_values offer_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id);


--
-- Name: options_property_values options_property_values_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: product_property_values product_property_values_catalog_products_fk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_products_fk_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: product_property_values product_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id);


--
-- Name: property_types property_types_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: users users_actors_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_actors_fk FOREIGN KEY (actor) REFERENCES public.actors(id);


--
-- Name: users users_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: catalog_types_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_types_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;
INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES(NEW.parent, NEW.id, 1);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_types_after_insert_fnc() OWNER TO dev;

--
-- Name: catalog_types_after_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_types_after_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
DELETE FROM public.catalog_types_overload AS o
USING public.catalog_types_overload AS och,
public.catalog_types_overload AS opr 
WHERE och.child=o.child AND opr.parent=o.parent
AND och.parent=OLD.id AND opr.child=OLD.id;

DELETE FROM public.catalog_types_overload AS o
WHERE o.child=OLD.id;

INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES(NEW.parent, NEW.id, 1);

INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;

INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT opr.parent, och.child, opr.delta+och.delta
FROM public.catalog_types_overload AS och
INNER JOIN public.catalog_types_overload AS opr ON TRUE
WHERE och.parent=NEW.id AND opr.child=NEW.id;

RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_types_after_update_fnc() OWNER TO dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actor_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.actor_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.actor_types OWNER TO dev;

--
-- Name: actor_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.actor_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actor_types_id_seq OWNER TO dev;

--
-- Name: actor_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.actor_types_id_seq OWNED BY public.actor_types.id;


--
-- Name: actors; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.actors (
    id integer NOT NULL,
    type integer NOT NULL,
    key integer
);


ALTER TABLE public.actors OWNER TO dev;

--
-- Name: actors_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.actors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actors_id_seq OWNER TO dev;

--
-- Name: actors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.actors_id_seq OWNED BY public.actors.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    key character varying NOT NULL,
    company integer NOT NULL,
    disposed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    disposed_at timestamp with time zone,
    actor integer NOT NULL
);


ALTER TABLE public.api_keys OWNER TO dev;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_id_seq OWNER TO dev;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: catalog_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_types (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    parent integer,
    root boolean DEFAULT false NOT NULL,
    level smallint NOT NULL
);


ALTER TABLE public.catalog_types OWNER TO dev;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO dev;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.catalog_types.id;


--
-- Name: catalog_brands; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_brands (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    description text,
    logo json
);


ALTER TABLE public.catalog_brands OWNER TO dev;

--
-- Name: catalog_brands_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_brands_id_seq OWNER TO dev;

--
-- Name: catalog_brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_brands_id_seq OWNED BY public.catalog_brands.id;


--
-- Name: catalog_metatypes; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_metatypes (
    id integer NOT NULL,
    catalog integer NOT NULL,
    metatype integer NOT NULL
);


ALTER TABLE public.catalog_metatypes OWNER TO dev;

--
-- Name: metatypes; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.metatypes (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.metatypes OWNER TO dev;

--
-- Name: catalog_metatypes_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_metatypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_metatypes_id_seq OWNER TO dev;

--
-- Name: catalog_metatypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_metatypes_id_seq OWNED BY public.metatypes.id;


--
-- Name: catalog_metatypes_id_seq1; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_metatypes_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_metatypes_id_seq1 OWNER TO dev;

--
-- Name: catalog_metatypes_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_metatypes_id_seq1 OWNED BY public.catalog_metatypes.id;


--
-- Name: catalog_product_offers; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_product_offers (
    id bigint NOT NULL,
    product bigint NOT NULL,
    catalog integer NOT NULL,
    article character varying NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.catalog_product_offers OWNER TO dev;

--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_product_offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_product_offers_id_seq OWNER TO dev;

--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_product_offers_id_seq OWNED BY public.catalog_product_offers.id;


--
-- Name: catalog_products; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_products (
    id bigint NOT NULL,
    catalog integer NOT NULL,
    type integer NOT NULL,
    brand integer NOT NULL,
    title character varying NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.catalog_products OWNER TO dev;

--
-- Name: catalog_products_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_products_id_seq OWNER TO dev;

--
-- Name: catalog_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_products_id_seq OWNED BY public.catalog_products.id;


--
-- Name: catalog_properties; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_properties (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    type integer NOT NULL,
    multiple boolean DEFAULT false NOT NULL,
    options boolean DEFAULT false NOT NULL
);


ALTER TABLE public.catalog_properties OWNER TO dev;

--
-- Name: catalog_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_properties_id_seq OWNER TO dev;

--
-- Name: catalog_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_properties_id_seq OWNED BY public.catalog_properties.id;


--
-- Name: catalog_types_overload; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_types_overload (
    parent integer NOT NULL,
    child integer NOT NULL,
    delta smallint NOT NULL
);


ALTER TABLE public.catalog_types_overload OWNER TO dev;

--
-- Name: catalogs; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalogs (
    id integer NOT NULL,
    title character varying NOT NULL,
    company integer NOT NULL
);


ALTER TABLE public.catalogs OWNER TO dev;

--
-- Name: catalogs_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogs_id_seq OWNER TO dev;

--
-- Name: catalogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalogs_id_seq OWNED BY public.catalogs.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.companies OWNER TO dev;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO dev;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.currencies (
    id smallint NOT NULL,
    key character varying NOT NULL,
    title character varying NOT NULL,
    symbol character varying DEFAULT ''::character varying NOT NULL,
    "precision" integer DEFAULT 4 NOT NULL,
    icon character varying
);


ALTER TABLE public.currencies OWNER TO dev;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.currencies_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currencies_id_seq OWNER TO dev;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


--
-- Name: offer_amounts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_amounts (
    offer bigint NOT NULL,
    store integer NOT NULL,
    amount numeric DEFAULT 0 NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT offer_amounts_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.offer_amounts OWNER TO dev;

--
-- Name: offer_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_property_values (
    offer bigint NOT NULL,
    property integer NOT NULL,
    value_key bigint NOT NULL
);


ALTER TABLE public.offer_property_values OWNER TO dev;

--
-- Name: offers_prices; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offers_prices (
    offer bigint NOT NULL,
    price_type integer NOT NULL,
    value numeric NOT NULL,
    currency integer NOT NULL,
    updated_at time with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_change numeric DEFAULT 0 NOT NULL,
    CONSTRAINT offers_prices_value_check CHECK ((value >= (0)::numeric))
);


ALTER TABLE public.offers_prices OWNER TO dev;

--
-- Name: options_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.options_property_values (
    id integer NOT NULL,
    property integer NOT NULL,
    value jsonb NOT NULL,
    hash character varying(48)
);


ALTER TABLE public.options_property_values OWNER TO dev;

--
-- Name: options_property_values_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.options_property_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.options_property_values_id_seq OWNER TO dev;

--
-- Name: options_property_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.options_property_values_id_seq OWNED BY public.options_property_values.id;


--
-- Name: price_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.price_types (
    id integer NOT NULL,
    company integer NOT NULL,
    title character varying NOT NULL,
    display_currency integer
);


ALTER TABLE public.price_types OWNER TO dev;

--
-- Name: price_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.price_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_types_id_seq OWNER TO dev;

--
-- Name: price_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.price_types_id_seq OWNED BY public.price_types.id;


--
-- Name: product_prices; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_prices (
    product bigint NOT NULL,
    price_type integer NOT NULL,
    value numeric NOT NULL,
    currency integer NOT NULL,
    updated_at time with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_change numeric DEFAULT 0 NOT NULL,
    CONSTRAINT product_prices_value_check CHECK ((value >= (0)::numeric))
);


ALTER TABLE public.product_prices OWNER TO dev;

--
-- Name: product_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_property_values (
    product bigint NOT NULL,
    property integer NOT NULL,
    value_key bigint NOT NULL
);


ALTER TABLE public.product_property_values OWNER TO dev;

--
-- Name: property_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.property_types (
    id integer NOT NULL,
    title character varying NOT NULL,
    scheme json NOT NULL,
    catalog integer
);


ALTER TABLE public.property_types OWNER TO dev;

--
-- Name: property_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.property_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_types_id_seq OWNER TO dev;

--
-- Name: property_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.property_types_id_seq OWNED BY public.property_types.id;


--
-- Name: property_value_id; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.property_value_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_value_id OWNER TO dev;

--
-- Name: property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.property_values (
    value_key bigint NOT NULL,
    "order" smallint NOT NULL,
    type integer NOT NULL,
    value jsonb NOT NULL
);


ALTER TABLE public.property_values OWNER TO dev;

--
-- Name: rates; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.rates (
    "from" integer NOT NULL,
    "to" integer NOT NULL,
    source integer NOT NULL,
    rate numeric NOT NULL,
    updated_at time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rates OWNER TO dev;

--
-- Name: rates_history; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.rates_history (
    "from" integer NOT NULL,
    "to" integer NOT NULL,
    source integer NOT NULL,
    date date NOT NULL,
    rate numeric NOT NULL
);


ALTER TABLE public.rates_history OWNER TO dev;

--
-- Name: rates_sources; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.rates_sources (
    id integer NOT NULL,
    title character varying NOT NULL,
    base_currency integer NOT NULL,
    timezone character varying DEFAULT 'UTC'::character varying NOT NULL,
    fine boolean DEFAULT false NOT NULL,
    fine_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    problem_info text
);


ALTER TABLE public.rates_sources OWNER TO dev;

--
-- Name: rates_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.rates_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rates_sources_id_seq OWNER TO dev;

--
-- Name: rates_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.rates_sources_id_seq OWNED BY public.rates_sources.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    company integer NOT NULL,
    title character varying NOT NULL,
    address character varying,
    geo_lat numeric,
    geo_long numeric
);


ALTER TABLE public.stores OWNER TO dev;

--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO dev;

--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- Name: unit_groups; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.unit_groups (
    id integer NOT NULL,
    title character varying NOT NULL,
    company integer,
    description text,
    base smallint
);


ALTER TABLE public.unit_groups OWNER TO dev;

--
-- Name: unit_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.unit_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_groups_id_seq OWNER TO dev;

--
-- Name: unit_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.unit_groups_id_seq OWNED BY public.unit_groups.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.units (
    id integer NOT NULL,
    company integer,
    title character varying NOT NULL,
    abbr character varying NOT NULL,
    "group" integer NOT NULL,
    add numeric NOT NULL,
    factor numeric NOT NULL
);


ALTER TABLE public.units OWNER TO dev;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.units_id_seq OWNER TO dev;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying NOT NULL,
    pwd_hash character varying NOT NULL,
    actor integer NOT NULL,
    created timestamp with time zone NOT NULL,
    company integer NOT NULL
);


ALTER TABLE public.users OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: actor_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types ALTER COLUMN id SET DEFAULT nextval('public.actor_types_id_seq'::regclass);


--
-- Name: actors id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors ALTER COLUMN id SET DEFAULT nextval('public.actors_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: catalog_brands id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands ALTER COLUMN id SET DEFAULT nextval('public.catalog_brands_id_seq'::regclass);


--
-- Name: catalog_metatypes id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatypes ALTER COLUMN id SET DEFAULT nextval('public.catalog_metatypes_id_seq1'::regclass);


--
-- Name: catalog_product_offers id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers ALTER COLUMN id SET DEFAULT nextval('public.catalog_product_offers_id_seq'::regclass);


--
-- Name: catalog_products id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products ALTER COLUMN id SET DEFAULT nextval('public.catalog_products_id_seq'::regclass);


--
-- Name: catalog_properties id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties ALTER COLUMN id SET DEFAULT nextval('public.catalog_properties_id_seq'::regclass);


--
-- Name: catalog_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: catalogs id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs ALTER COLUMN id SET DEFAULT nextval('public.catalogs_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: metatypes id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.metatypes ALTER COLUMN id SET DEFAULT nextval('public.catalog_metatypes_id_seq'::regclass);


--
-- Name: options_property_values id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values ALTER COLUMN id SET DEFAULT nextval('public.options_property_values_id_seq'::regclass);


--
-- Name: price_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types ALTER COLUMN id SET DEFAULT nextval('public.price_types_id_seq'::regclass);


--
-- Name: property_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types ALTER COLUMN id SET DEFAULT nextval('public.property_types_id_seq'::regclass);


--
-- Name: rates_sources id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates_sources ALTER COLUMN id SET DEFAULT nextval('public.rates_sources_id_seq'::regclass);


--
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- Name: unit_groups id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.unit_groups ALTER COLUMN id SET DEFAULT nextval('public.unit_groups_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: actor_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.actor_types (id, title) FROM stdin;
1	User
2	Api key
3	Robot
\.


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.actors (id, type, key) FROM stdin;
1	2	4
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.api_keys (id, key, company, disposed, created_at, disposed_at, actor) FROM stdin;
4	123	1	f	2024-03-12 00:44:33.964296+03	\N	1
\.


--
-- Data for Name: catalog_brands; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_brands (id, catalog, title, description, logo) FROM stdin;
6	1	ikea348	\N	\N
8	1	ikea348   	\N	\N
9	1	ikea348     	\N	\N
10	1	ikea348      	\N	\N
11	1	ikea348        	\N	\N
12	1	ik	\N	\N
13	1	  ikea	\N	\N
14	1	 ikea	\N	\N
15	1	     ikea	\N	\N
16	1	      ikea	\N	\N
17	1	         ikea	\N	\N
18	1	          ikea	\N	\N
19	1	zikea	\N	\N
20	1	ikega	\N	\N
21	1	ikehga	\N	\N
22	1	ikeffhga	\N	\N
3	1	ikea	iiiiii	{"key":"0-0-0-22b847b1601169d5f9d6f.png","url":"https://logosdownload.com/logo/IKEA-logo-big-logotype.png","status":1}
\.


--
-- Data for Name: catalog_metatypes; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_metatypes (id, catalog, metatype) FROM stdin;
\.


--
-- Data for Name: catalog_product_offers; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_product_offers (id, product, catalog, article, created) FROM stdin;
\.


--
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_products (id, catalog, type, brand, title, created) FROM stdin;
\.


--
-- Data for Name: catalog_properties; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_properties (id, catalog, title, type, multiple, options) FROM stdin;
\.


--
-- Data for Name: catalog_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types (id, catalog, title, parent, root, level) FROM stdin;
2	1	root-1	\N	t	0
8	1	t1	2	f	1
9	1	oooo	8	f	2
11	1	boots	2	f	1
\.


--
-- Data for Name: catalog_types_overload; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types_overload (parent, child, delta) FROM stdin;
2	8	1
8	9	1
2	9	2
2	11	1
\.


--
-- Data for Name: catalogs; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalogs (id, title, company) FROM stdin;
1	ololo	1
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.companies (id, title) FROM stdin;
1	test
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.currencies (id, key, title, symbol, "precision", icon) FROM stdin;
\.


--
-- Data for Name: metatypes; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.metatypes (id, title) FROM stdin;
1	Catalog type
2	Catalog brand
3	Brand collection
\.


--
-- Data for Name: offer_amounts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offer_amounts (offer, store, amount, changed_at) FROM stdin;
\.


--
-- Data for Name: offer_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offer_property_values (offer, property, value_key) FROM stdin;
\.


--
-- Data for Name: offers_prices; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offers_prices (offer, price_type, value, currency, updated_at, last_change) FROM stdin;
\.


--
-- Data for Name: options_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.options_property_values (id, property, value, hash) FROM stdin;
\.


--
-- Data for Name: price_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.price_types (id, company, title, display_currency) FROM stdin;
\.


--
-- Data for Name: product_prices; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_prices (product, price_type, value, currency, updated_at, last_change) FROM stdin;
\.


--
-- Data for Name: product_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_property_values (product, property, value_key) FROM stdin;
\.


--
-- Data for Name: property_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_types (id, title, scheme, catalog) FROM stdin;
\.


--
-- Data for Name: property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_values (value_key, "order", type, value) FROM stdin;
\.


--
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates ("from", "to", source, rate, updated_at) FROM stdin;
\.


--
-- Data for Name: rates_history; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates_history ("from", "to", source, date, rate) FROM stdin;
\.


--
-- Data for Name: rates_sources; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates_sources (id, title, base_currency, timezone, fine, fine_at, problem_info) FROM stdin;
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.stores (id, company, title, address, geo_lat, geo_long) FROM stdin;
\.


--
-- Data for Name: unit_groups; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.unit_groups (id, title, company, description, base) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.units (id, company, title, abbr, "group", add, factor) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users (id, login, pwd_hash, actor, created, company) FROM stdin;
\.


--
-- Name: actor_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.actor_types_id_seq', 4, true);


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.actors_id_seq', 1, true);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 4, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.brands_id_seq', 11, true);


--
-- Name: catalog_brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_brands_id_seq', 22, true);


--
-- Name: catalog_metatypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_metatypes_id_seq', 3, true);


--
-- Name: catalog_metatypes_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_metatypes_id_seq1', 1, false);


--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_product_offers_id_seq', 1, false);


--
-- Name: catalog_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_products_id_seq', 1, false);


--
-- Name: catalog_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_properties_id_seq', 1, false);


--
-- Name: catalogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalogs_id_seq', 1, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, true);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.currencies_id_seq', 1, false);


--
-- Name: options_property_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.options_property_values_id_seq', 1, false);


--
-- Name: price_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.price_types_id_seq', 1, false);


--
-- Name: property_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_types_id_seq', 1, false);


--
-- Name: property_value_id; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_value_id', 2, true);


--
-- Name: rates_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.rates_sources_id_seq', 1, false);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.stores_id_seq', 1, false);


--
-- Name: unit_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.unit_groups_id_seq', 1, false);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.units_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: actor_types actor_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types
    ADD CONSTRAINT actor_types_pk PRIMARY KEY (id);


--
-- Name: actor_types actor_types_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actor_types
    ADD CONSTRAINT actor_types_title_uind UNIQUE (title);


--
-- Name: actors actors_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pk PRIMARY KEY (id);


--
-- Name: actors actors_type_key_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_type_key_uind UNIQUE (type, key);


--
-- Name: api_keys api_keys_key_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_uind UNIQUE (key);


--
-- Name: api_keys api_keys_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pk PRIMARY KEY (id);


--
-- Name: catalog_brands catalog_brands_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_brands catalog_brands_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_pk PRIMARY KEY (id);


--
-- Name: catalog_metatypes catalog_metatypes_catalog_metatype_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatypes
    ADD CONSTRAINT catalog_metatypes_catalog_metatype_uind UNIQUE (catalog, metatype);


--
-- Name: catalog_metatypes catalog_metatypes_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatypes
    ADD CONSTRAINT catalog_metatypes_pk PRIMARY KEY (id);


--
-- Name: catalog_product_offers catalog_product_offers_catalog_article_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalog_article_uind UNIQUE (catalog, article);


--
-- Name: catalog_product_offers catalog_product_offers_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_pk PRIMARY KEY (id);


--
-- Name: catalog_products catalog_products_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_products catalog_products_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_pk PRIMARY KEY (id);


--
-- Name: catalog_properties catalog_properties_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: catalog_properties catalog_properties_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_pk PRIMARY KEY (id);


--
-- Name: catalog_types_overload catalog_types_overload_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_pk PRIMARY KEY (parent, child);


--
-- Name: catalog_types catalog_types_parent_title; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_parent_title UNIQUE (parent, title);


--
-- Name: catalog_types catalog_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_pk PRIMARY KEY (id);


--
-- Name: catalogs catalogs_company_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_company_title_uind UNIQUE (company, title);


--
-- Name: catalogs catalogs_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_pk PRIMARY KEY (id);


--
-- Name: companies companies_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pk PRIMARY KEY (id);


--
-- Name: companies companies_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_title_uind UNIQUE (title);


--
-- Name: currencies currencies_key_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_key_uind UNIQUE (key);


--
-- Name: currencies currencies_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pk PRIMARY KEY (id);


--
-- Name: currencies currencies_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_title_uind UNIQUE (title);


--
-- Name: metatypes metatypes_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.metatypes
    ADD CONSTRAINT metatypes_pk PRIMARY KEY (id);


--
-- Name: metatypes metatypes_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.metatypes
    ADD CONSTRAINT metatypes_title_uind UNIQUE (title);


--
-- Name: offer_amounts offer_amounts_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_amounts
    ADD CONSTRAINT offer_amounts_pk PRIMARY KEY (store, offer);


--
-- Name: offer_property_values offer_property_values_offer_property_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_offer_property_uind PRIMARY KEY (offer, property);


--
-- Name: offers_prices offers_prices_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offers_prices
    ADD CONSTRAINT offers_prices_pk PRIMARY KEY (offer, price_type);


--
-- Name: options_property_values options_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_pk PRIMARY KEY (id);


--
-- Name: options_property_values options_property_values_property_hash_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_property_hash_uind UNIQUE (property, hash);


--
-- Name: price_types price_types_company_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_company_title_uind UNIQUE (company, title);


--
-- Name: price_types price_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_pk PRIMARY KEY (id);


--
-- Name: product_prices product_prices_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_pk PRIMARY KEY (product, price_type);


--
-- Name: product_property_values product_property_values_product_property_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_product_property_uind PRIMARY KEY (product, property);


--
-- Name: property_types property_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_pk PRIMARY KEY (id);


--
-- Name: property_values property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_values
    ADD CONSTRAINT property_values_pk PRIMARY KEY (value_key, "order");


--
-- Name: rates_history rates_history_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates_history
    ADD CONSTRAINT rates_history_pk PRIMARY KEY (source, "from", "to", date);


--
-- Name: rates rates_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pk PRIMARY KEY (source, "from", "to");


--
-- Name: rates_sources rates_sources_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates_sources
    ADD CONSTRAINT rates_sources_pk PRIMARY KEY (id);


--
-- Name: rates_sources rates_sources_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates_sources
    ADD CONSTRAINT rates_sources_title_uind UNIQUE (title);


--
-- Name: stores stores_company_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_company_title_uind UNIQUE (company, title);


--
-- Name: stores stores_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pk PRIMARY KEY (id);


--
-- Name: unit_groups unit_groups_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.unit_groups
    ADD CONSTRAINT unit_groups_pk PRIMARY KEY (id);


--
-- Name: units units_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pk PRIMARY KEY (id);


--
-- Name: users users_login_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_uind UNIQUE (login);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: offer_property_values_keys_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX offer_property_values_keys_ind ON public.offer_property_values USING btree (value_key DESC);


--
-- Name: product_property_values_keys_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX product_property_values_keys_ind ON public.product_property_values USING btree (value_key DESC);


--
-- Name: property_types_catalog_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_catalog_title_uind ON public.property_types USING btree (catalog, title) WHERE (catalog IS NOT NULL);


--
-- Name: property_types_common_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (catalog, title) WHERE (catalog IS NULL);


--
-- Name: catalog_types catalog_types_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_insert AFTER INSERT ON public.catalog_types FOR EACH ROW WHEN ((new.parent IS NOT NULL)) EXECUTE FUNCTION public.catalog_types_after_insert_fnc();


--
-- Name: catalog_types catalog_types_after_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_update AFTER UPDATE ON public.catalog_types FOR EACH ROW WHEN ((old.parent IS DISTINCT FROM new.parent)) EXECUTE FUNCTION public.catalog_types_after_update_fnc();


--
-- Name: actors actors_actor_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_actor_types_fk FOREIGN KEY (type) REFERENCES public.actor_types(id);


--
-- Name: api_keys api_keys_actors_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_actors_fk FOREIGN KEY (actor) REFERENCES public.actors(id);


--
-- Name: api_keys api_keys_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: catalog_brands catalog_brands_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_metatypes catalog_metatypes_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatypes
    ADD CONSTRAINT catalog_metatypes_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id) ON DELETE CASCADE;


--
-- Name: catalog_metatypes catalog_metatypes_metatypes_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatypes
    ADD CONSTRAINT catalog_metatypes_metatypes_fk FOREIGN KEY (metatype) REFERENCES public.metatypes(id);


--
-- Name: catalog_product_offers catalog_product_offers_catalog_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalog_products_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id);


--
-- Name: catalog_product_offers catalog_product_offers_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_products catalog_products_catalog_brands_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_brands_fk FOREIGN KEY (brand) REFERENCES public.catalog_brands(id);


--
-- Name: catalog_products catalog_products_catalog_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_types_fk FOREIGN KEY (type) REFERENCES public.catalog_types(id);


--
-- Name: catalog_products catalog_products_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_properties catalog_properties_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_properties catalog_properties_property_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_properties
    ADD CONSTRAINT catalog_properties_property_types_fk FOREIGN KEY (type) REFERENCES public.property_types(id);


--
-- Name: catalog_types catalog_types_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_types_overload catalog_types_overload_catalog_types_child_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_catalog_types_child_id_fk FOREIGN KEY (child) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


--
-- Name: catalog_types_overload catalog_types_overload_catalog_types_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types_overload
    ADD CONSTRAINT catalog_types_overload_catalog_types_parent_id_fk FOREIGN KEY (parent) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


--
-- Name: catalog_types catalog_types_parent_id_req_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_types
    ADD CONSTRAINT catalog_types_parent_id_req_fk FOREIGN KEY (parent) REFERENCES public.catalog_types(id);


--
-- Name: catalogs catalogs_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalogs
    ADD CONSTRAINT catalogs_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: offer_amounts offer_amounts_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_amounts
    ADD CONSTRAINT offer_amounts_offers_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offer_amounts offer_amounts_stores_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_amounts
    ADD CONSTRAINT offer_amounts_stores_fk FOREIGN KEY (store) REFERENCES public.stores(id);


--
-- Name: offer_property_values offer_property_values_catalog_product_offers_fk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_product_offers_fk_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offer_property_values offer_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id);


--
-- Name: offers_prices offers_prices_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offers_prices
    ADD CONSTRAINT offers_prices_offers_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offers_prices offers_prices_price_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offers_prices
    ADD CONSTRAINT offers_prices_price_types_fk FOREIGN KEY (price_type) REFERENCES public.price_types(id);


--
-- Name: options_property_values options_property_values_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: price_types price_types_currencies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_currencies_fk FOREIGN KEY (display_currency) REFERENCES public.currencies(id) ON DELETE SET NULL;


--
-- Name: product_prices product_prices_price_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_price_types_fk FOREIGN KEY (price_type) REFERENCES public.price_types(id);


--
-- Name: product_prices product_prices_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_products_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: product_property_values product_property_values_catalog_products_fk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_products_fk_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: product_property_values product_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id);


--
-- Name: property_types property_types_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: property_values property_values_property_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_values
    ADD CONSTRAINT property_values_property_types_fk FOREIGN KEY (type) REFERENCES public.property_types(id);


--
-- Name: rates rates_currencies_from_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_currencies_from_id_fk FOREIGN KEY ("from") REFERENCES public.currencies(id) ON DELETE CASCADE;


--
-- Name: rates rates_currencies_to_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_currencies_to_id_fk FOREIGN KEY ("to") REFERENCES public.currencies(id) ON DELETE CASCADE;


--
-- Name: rates rates_rates_sources_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_rates_sources_fk FOREIGN KEY (source) REFERENCES public.rates_sources(id);


--
-- Name: rates_sources rates_sources_currencies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.rates_sources
    ADD CONSTRAINT rates_sources_currencies_fk FOREIGN KEY (base_currency) REFERENCES public.currencies(id);


--
-- Name: stores stores_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: unit_groups unit_groups_compnies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.unit_groups
    ADD CONSTRAINT unit_groups_compnies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: unit_groups unit_groups_units_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.unit_groups
    ADD CONSTRAINT unit_groups_units_fk FOREIGN KEY (base) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- Name: units units_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: units units_unit_groups_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_unit_groups_fk FOREIGN KEY ("group") REFERENCES public.unit_groups(id) ON DELETE CASCADE;


--
-- Name: users users_actors_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_actors_fk FOREIGN KEY (actor) REFERENCES public.actors(id);


--
-- Name: users users_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- PostgreSQL database dump complete
--

