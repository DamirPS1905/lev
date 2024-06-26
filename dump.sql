--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

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
-- Name: catalog_product_offers_after_delete_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_product_offers_after_delete_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count - 1
WHERE id=NEW.product;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_product_offers_after_delete_fnc() OWNER TO dev;

--
-- Name: catalog_product_offers_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_product_offers_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count + 1
WHERE id=NEW.product;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_product_offers_after_insert_fnc() OWNER TO dev;

--
-- Name: catalog_product_offers_after_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_product_offers_after_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count - (NEW.article IS NULL)::int + (OLD.article IS NULL)::int
WHERE id=NEW.product;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_product_offers_after_update_fnc() OWNER TO dev;

--
-- Name: catalog_products_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_products_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO catalog_product_offers (catalog, product, article)
VALUES(NEW.catalog, NEW.id, NULL);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_products_after_insert_fnc() OWNER TO dev;

--
-- Name: catalog_types_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalog_types_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES (NEW.id, NEW.id, 0);
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;
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
AND och.parent=OLD.id AND opr.child=OLD.parent AND o.parent!=o.child;

INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT opr.parent, och.child, opr.delta+och.delta+1
FROM public.catalog_types_overload AS och
INNER JOIN public.catalog_types_overload AS opr ON TRUE
WHERE och.parent=NEW.id AND opr.child=NEW.parent;

RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalog_types_after_update_fnc() OWNER TO dev;

--
-- Name: catalogs_after_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.catalogs_after_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO catalog_types (catalog, title, parent, root, level)
VALUES (NEW.id, CONCAT('root-', NEW.id), NULL, TRUE, 0);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.catalogs_after_insert_fnc() OWNER TO dev;

--
-- Name: offer_amounts_before_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.offer_amounts_before_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('amounts_time')::int8);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.offer_amounts_before_update_fnc() OWNER TO dev;

--
-- Name: offer_prices_before_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.offer_prices_before_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
NEW.last_change = NEW."index" - OLD."index";
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('offer_prices_time')::int8);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.offer_prices_before_update_fnc() OWNER TO dev;

--
-- Name: prices_before_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.prices_before_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
NEW.last_change = NEW."index" - OLD."index";
NEW.changed_at = CURRENT_TIMESTAMP;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.prices_before_update_fnc() OWNER TO dev;

--
-- Name: product_prices_before_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.product_prices_before_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
NEW.last_change = NEW."index" - OLD."index";
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('product_prices_time')::int8);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.product_prices_before_update_fnc() OWNER TO dev;

--
-- Name: rates_after_update_insert_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.rates_after_update_insert_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
INSERT INTO public.rates_history (source, "from", "to", "date", rate)
VALUES(NEW.source, NEW."from", NEW."to", date(NEW."updated_at"), NEW.rate)
ON CONFLICT (source, "from", "to", "date") DO UPDATE SET rate = EXCLUDED.rate;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.rates_after_update_insert_fnc() OWNER TO dev;

--
-- Name: relations_before_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.relations_before_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('relations_time')::int8);
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.relations_before_update_fnc() OWNER TO dev;

--
-- Name: unit_groups_after_update_fnc(); Type: FUNCTION; Schema: public; Owner: dev
--

CREATE FUNCTION public.unit_groups_after_update_fnc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
UPDATE units u
SET factor = u.factor/nb.factor, "add" = u."add" - u.factor/nb.factor*u."add"
FROM units AS nb
WHERE
	nb.id=NEW.base
	AND u.group = NEW.id;
RETURN NEW;
	END;
$$;


ALTER FUNCTION public.unit_groups_after_update_fnc() OWNER TO dev;

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
    key integer,
    company integer
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
-- Name: amounts_time; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.amounts_time
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.amounts_time OWNER TO dev;

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
-- Name: brand_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.brand_property_values (
    instance integer NOT NULL,
    property integer NOT NULL,
    "order" smallint NOT NULL,
    value bigint NOT NULL
);


ALTER TABLE public.brand_property_values OWNER TO dev;

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
-- Name: catalog_brand_collections; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_brand_collections (
    id integer NOT NULL,
    brand integer NOT NULL,
    title character varying NOT NULL,
    image character varying
);


ALTER TABLE public.catalog_brand_collections OWNER TO dev;

--
-- Name: catalog_brand_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.catalog_brand_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalog_brand_collections_id_seq OWNER TO dev;

--
-- Name: catalog_brand_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.catalog_brand_collections_id_seq OWNED BY public.catalog_brand_collections.id;


--
-- Name: catalog_brands; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_brands (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    description text,
    image character varying
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
-- Name: catalog_metatype_properties; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_metatype_properties (
    metatype integer NOT NULL,
    catalog integer NOT NULL,
    property integer NOT NULL,
    scheme jsonb NOT NULL
);


ALTER TABLE public.catalog_metatype_properties OWNER TO dev;

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
-- Name: catalog_product_offers; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.catalog_product_offers (
    id bigint NOT NULL,
    product bigint NOT NULL,
    catalog integer NOT NULL,
    article character varying,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image character varying
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
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    collection integer,
    offers_count smallint DEFAULT 0 NOT NULL,
    accounting_unit integer NOT NULL,
    image character varying
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
    options boolean DEFAULT false NOT NULL,
    scheme jsonb NOT NULL
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
-- Name: collection_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.collection_property_values (
    instance integer NOT NULL,
    property integer NOT NULL,
    "order" smallint NOT NULL,
    value bigint NOT NULL
);


ALTER TABLE public.collection_property_values OWNER TO dev;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    title character varying NOT NULL,
    balance numeric(15,2) DEFAULT 0 NOT NULL
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
-- Name: file_load_tasks; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.file_load_tasks (
    id bigint NOT NULL,
    url character varying NOT NULL,
    processed boolean DEFAULT false NOT NULL,
    loaded boolean DEFAULT false NOT NULL,
    key character varying NOT NULL,
    error character varying,
    as_image boolean NOT NULL,
    company integer NOT NULL
);


ALTER TABLE public.file_load_tasks OWNER TO dev;

--
-- Name: file_load_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.file_load_tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.file_load_tasks_id_seq OWNER TO dev;

--
-- Name: file_load_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.file_load_tasks_id_seq OWNED BY public.file_load_tasks.id;


--
-- Name: instance_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.instance_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.instance_types OWNER TO dev;

--
-- Name: instance_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.instance_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instance_types_id_seq OWNER TO dev;

--
-- Name: instance_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.instance_types_id_seq OWNED BY public.instance_types.id;


--
-- Name: instance_versions; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.instance_versions (
    company integer NOT NULL,
    catalog integer NOT NULL,
    instance_type integer NOT NULL,
    instance bigint NOT NULL,
    version bigint NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.instance_versions OWNER TO dev;

--
-- Name: offer_amounts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_amounts (
    offer bigint NOT NULL,
    store integer NOT NULL,
    amount numeric(18,6) DEFAULT 0 NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version bigint DEFAULT nextval('public.amounts_time'::regclass) NOT NULL,
    CONSTRAINT offer_amounts_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.offer_amounts OWNER TO dev;

--
-- Name: offer_prices_time; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.offer_prices_time
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offer_prices_time OWNER TO dev;

--
-- Name: offer_prices; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_prices (
    offer bigint NOT NULL,
    price_type integer NOT NULL,
    value numeric(18,2) NOT NULL,
    currency integer NOT NULL,
    last_change numeric(18,2) DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    index numeric(18,2) NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    version bigint DEFAULT nextval('public.offer_prices_time'::regclass) NOT NULL,
    CONSTRAINT offer_prices_value_check CHECK ((value >= (0)::numeric))
);


ALTER TABLE public.offer_prices OWNER TO dev;

--
-- Name: offer_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.offer_property_values (
    offer bigint NOT NULL,
    property integer NOT NULL,
    "order" smallint NOT NULL,
    value bigint NOT NULL
);


ALTER TABLE public.offer_property_values OWNER TO dev;

--
-- Name: relations_time; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.relations_time
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relations_time OWNER TO dev;

--
-- Name: oo_relation_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.oo_relation_values (
    relation integer NOT NULL,
    source bigint NOT NULL,
    target bigint NOT NULL,
    version bigint DEFAULT nextval('public.relations_time'::regclass) NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.oo_relation_values OWNER TO dev;

--
-- Name: op_relation_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.op_relation_values (
    relation integer NOT NULL,
    source bigint NOT NULL,
    target bigint NOT NULL,
    version bigint DEFAULT nextval('public.relations_time'::regclass) NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.op_relation_values OWNER TO dev;

--
-- Name: options_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.options_property_values (
    property integer NOT NULL,
    value bigint NOT NULL,
    hash character varying(48)
);


ALTER TABLE public.options_property_values OWNER TO dev;

--
-- Name: po_relation_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.po_relation_values (
    relation integer NOT NULL,
    source bigint NOT NULL,
    target bigint NOT NULL,
    version bigint DEFAULT nextval('public.relations_time'::regclass) NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.po_relation_values OWNER TO dev;

--
-- Name: pp_relation_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.pp_relation_values (
    relation integer NOT NULL,
    source bigint NOT NULL,
    target bigint NOT NULL,
    version bigint DEFAULT nextval('public.relations_time'::regclass) NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pp_relation_values OWNER TO dev;

--
-- Name: price_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.price_types (
    id integer NOT NULL,
    company integer NOT NULL,
    title character varying NOT NULL,
    display_currency integer,
    base_currency integer NOT NULL
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
-- Name: product_prices_time; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.product_prices_time
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_prices_time OWNER TO dev;

--
-- Name: product_prices; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_prices (
    product bigint NOT NULL,
    price_type integer NOT NULL,
    value numeric(18,2) NOT NULL,
    currency integer NOT NULL,
    last_change numeric(18,2) DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    index numeric(18,2) NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    version bigint DEFAULT nextval('public.product_prices_time'::regclass) NOT NULL,
    CONSTRAINT product_prices_value_check CHECK ((value >= (0)::numeric))
);


ALTER TABLE public.product_prices OWNER TO dev;

--
-- Name: product_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_property_values (
    product bigint NOT NULL,
    property integer NOT NULL,
    "order" smallint NOT NULL,
    value bigint NOT NULL
);


ALTER TABLE public.product_property_values OWNER TO dev;

--
-- Name: product_relations; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.product_relations (
    id integer NOT NULL,
    catalog integer NOT NULL,
    title character varying NOT NULL,
    kind smallint NOT NULL,
    "symmetric" boolean NOT NULL
);


ALTER TABLE public.product_relations OWNER TO dev;

--
-- Name: product_relations_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.product_relations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_relations_id_seq OWNER TO dev;

--
-- Name: product_relations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.product_relations_id_seq OWNED BY public.product_relations.id;


--
-- Name: products_relation_kinds; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.products_relation_kinds (
    id smallint NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.products_relation_kinds OWNER TO dev;

--
-- Name: products_relation_kinds_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.products_relation_kinds_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_relation_kinds_id_seq OWNER TO dev;

--
-- Name: products_relation_kinds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.products_relation_kinds_id_seq OWNED BY public.products_relation_kinds.id;


--
-- Name: property_in_types; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.property_in_types (
    type integer NOT NULL,
    property integer NOT NULL,
    scheme jsonb NOT NULL
);


ALTER TABLE public.property_in_types OWNER TO dev;

--
-- Name: property_primitives; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.property_primitives (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.property_primitives OWNER TO dev;

--
-- Name: property_primitives_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.property_primitives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_primitives_id_seq OWNER TO dev;

--
-- Name: property_primitives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.property_primitives_id_seq OWNED BY public.property_primitives.id;


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
    rate numeric(18,9) NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    rate numeric(18,9) NOT NULL
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
-- Name: type_property_values; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.type_property_values (
    instance integer NOT NULL,
    property integer NOT NULL,
    "order" smallint NOT NULL,
    value bigint NOT NULL
);


ALTER TABLE public.type_property_values OWNER TO dev;

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
    add double precision DEFAULT 0 NOT NULL,
    factor double precision DEFAULT 1 NOT NULL
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
-- Name: versions_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.versions_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.versions_seq OWNER TO dev;

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
-- Name: catalog_brand_collections id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brand_collections ALTER COLUMN id SET DEFAULT nextval('public.catalog_brand_collections_id_seq'::regclass);


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
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: file_load_tasks id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.file_load_tasks ALTER COLUMN id SET DEFAULT nextval('public.file_load_tasks_id_seq'::regclass);


--
-- Name: instance_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.instance_types ALTER COLUMN id SET DEFAULT nextval('public.instance_types_id_seq'::regclass);


--
-- Name: metatypes id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.metatypes ALTER COLUMN id SET DEFAULT nextval('public.catalog_metatypes_id_seq'::regclass);


--
-- Name: price_types id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types ALTER COLUMN id SET DEFAULT nextval('public.price_types_id_seq'::regclass);


--
-- Name: product_relations id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_relations ALTER COLUMN id SET DEFAULT nextval('public.product_relations_id_seq'::regclass);


--
-- Name: products_relation_kinds id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products_relation_kinds ALTER COLUMN id SET DEFAULT nextval('public.products_relation_kinds_id_seq'::regclass);


--
-- Name: property_primitives id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_primitives ALTER COLUMN id SET DEFAULT nextval('public.property_primitives_id_seq'::regclass);


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

COPY public.actors (id, type, key, company) FROM stdin;
1	2	4	1
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.api_keys (id, key, company, disposed, created_at, disposed_at, actor) FROM stdin;
4	123	1	f	2024-03-12 00:44:33.964296+03	\N	1
\.


--
-- Data for Name: brand_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.brand_property_values (instance, property, "order", value) FROM stdin;
6	1	0	18
6	3	0	19
6	4	0	20
6	5	0	21
6	5	1	22
6	6	0	24
6	7	0	27
\.


--
-- Data for Name: catalog_brand_collections; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_brand_collections (id, brand, title, image) FROM stdin;
1	6	cool	0-1-1-0-f17f6baff7855f820ddff.jpeg
\.


--
-- Data for Name: catalog_brands; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_brands (id, catalog, title, description, image) FROM stdin;
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
3	1	ikea	iiiiii	\N
6	1	ikea348	\N	0-1-1-0-8ca73e7863453319fe58d.png
\.


--
-- Data for Name: catalog_metatype_properties; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_metatype_properties (metatype, catalog, property, scheme) FROM stdin;
2	1	1	{"value": {"kind": 3}}
2	1	3	{"value": {"kind": 6, "unitsGroup": 1, "storageUnit": 1}}
2	1	4	{"value": {"kind": 5, "unitsGroup": 2, "defaultUnit": 4, "storageUnit": 4}}
2	1	5	{"value": {"kind": 3}}
2	1	6	{"value": {"kind": 3}}
2	1	7	{"value": {"kind": 8}}
\.


--
-- Data for Name: catalog_product_offers; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_product_offers (id, product, catalog, article, created, image) FROM stdin;
2	3	1	\N	2024-04-18 00:20:04.525351+03	\N
1	1	1	FFh	2024-04-11 04:54:35.363165+03	\N
5	4	1	second...	2024-04-18 00:46:56.357825+03	\N
6	4	1	third...	2024-04-18 00:58:32.429522+03	\N
7	4	1	third..	2024-04-18 01:05:47.822241+03	\N
8	4	1	third.	2024-04-18 01:12:11.552872+03	\N
9	4	1	third	2024-04-18 01:14:51.889892+03	\N
10	4	1	yyy	2024-04-18 01:20:05.26237+03	\N
12	5	1	\N	2024-04-18 02:33:06.201808+03	\N
16	9	1	hhhh	2024-04-19 01:07:19.958374+03	\N
3	4	1	first...	2024-04-18 00:20:56.432115+03	0-1-1-0-963ba439c67c0fc1978c1.jpg
\.


--
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_products (id, catalog, type, brand, title, created, collection, offers_count, accounting_unit, image) FROM stdin;
1	1	9	6	Fucken first	2024-04-10 02:50:17.864553+03	\N	1	1	\N
3	1	9	6	Single	2024-04-18 00:20:04.525351+03	\N	0	1	\N
4	1	9	6	two offers	2024-04-18 00:20:56.432115+03	\N	7	1	\N
9	1	9	6	yopta	2024-04-19 01:07:19.958374+03	1	1	1	\N
5	1	9	6	loos	2024-04-18 01:49:21.271494+03	1	1	1	0-1-1-0-d091a564f29611fe42300.jpeg
\.


--
-- Data for Name: catalog_properties; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_properties (id, catalog, title, type, multiple, options, scheme) FROM stdin;
1	1	Text test	1	f	f	{"value": {"kind": 3}}
5	1	test multi	1	t	f	{"value": {"kind": 3}}
6	1	test opt	1	f	t	{"value": {"kind": 3}}
7	1	test bool	2	f	f	{"value": {"kind": 8}}
4	1	объем	6	f	f	{"value": {"kind": 5, "unitsGroup": 2, "storageUnit": 4}}
3	1	вес	7	f	f	{"value": {"kind": 6, "unitsGroup": 1, "storageUnit": 1}}
8	1	image	8	f	f	{"file": {"kind": 9}, "title": {"kind": 3}}
\.


--
-- Data for Name: catalog_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types (id, catalog, title, parent, root, level) FROM stdin;
2	1	root-1	\N	t	0
8	1	t1	2	f	1
9	1	oooo	8	f	2
11	1	boots	2	f	1
13	1	kkkk	12	f	4
12	1	fff	11	f	2
14	3	root-3	\N	t	0
\.


--
-- Data for Name: catalog_types_overload; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalog_types_overload (parent, child, delta) FROM stdin;
2	2	0
8	8	0
9	9	0
11	11	0
2	8	1
8	9	1
2	11	1
2	9	2
12	12	0
13	13	0
12	13	1
11	12	1
2	12	2
11	13	2
2	13	3
\.


--
-- Data for Name: catalogs; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.catalogs (id, title, company) FROM stdin;
1	ololo	1
3	upd test	1
\.


--
-- Data for Name: collection_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.collection_property_values (instance, property, "order", value) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.companies (id, title, balance) FROM stdin;
1	test	0.00
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.currencies (id, key, title, symbol, "precision", icon) FROM stdin;
2	RUB	Российский рубль		4	\N
3	AUD	Австралийский доллар		4	\N
4	AZN	Азербайджанский манат		4	\N
5	GBP	Фунт стерлингов Соединенного королевства		4	\N
6	AMD	Армянских драмов		4	\N
7	BYN	Белорусский рубль		4	\N
8	BGN	Болгарский лев		4	\N
9	BRL	Бразильский реал		4	\N
10	HUF	Венгерских форинтов		4	\N
11	VND	Вьетнамских донгов		4	\N
12	HKD	Гонконгский доллар		4	\N
13	GEL	Грузинский лари		4	\N
14	DKK	Датская крона		4	\N
15	AED	Дирхам ОАЭ		4	\N
16	USD	Доллар США		4	\N
17	EUR	Евро		4	\N
18	EGP	Египетских фунтов		4	\N
19	INR	Индийских рупий		4	\N
20	IDR	Индонезийских рупий		4	\N
21	KZT	Казахстанских тенге		4	\N
22	CAD	Канадский доллар		4	\N
23	QAR	Катарский риал		4	\N
24	KGS	Киргизских сомов		4	\N
25	CNY	Китайский юань		4	\N
26	MDL	Молдавских леев		4	\N
27	NZD	Новозеландский доллар		4	\N
28	NOK	Норвежских крон		4	\N
29	PLN	Польский злотый		4	\N
30	RON	Румынский лей		4	\N
31	XDR	СДР (специальные права заимствования)		4	\N
32	SGD	Сингапурский доллар		4	\N
33	TJS	Таджикских сомони		4	\N
34	THB	Таиландских батов		4	\N
35	TRY	Турецких лир		4	\N
36	TMT	Новый туркменский манат		4	\N
37	UZS	Узбекских сумов		4	\N
38	UAH	Украинских гривен		4	\N
39	CZK	Чешских крон		4	\N
40	SEK	Шведских крон		4	\N
41	CHF	Швейцарский франк		4	\N
42	RSD	Сербских динаров		4	\N
43	ZAR	Южноафриканских рэндов		4	\N
44	KRW	Вон Республики Корея		4	\N
45	JPY	Японских иен		4	\N
\.


--
-- Data for Name: file_load_tasks; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.file_load_tasks (id, url, processed, loaded, key, error, as_image, company) FROM stdin;
1	https://static2.bigstockphoto.com/5/2/6/large1500/62597684.jpg	t	t	0-1-1-0-f17f6baff7855f820ddff.jpeg	\N	t	1
2	//static2.bigstockphoto.com/5/2/6/large1500/62597684.jpg	t	f	0-1-1-0-b6c8b211bcb583a7fe818.https	-3007: ENOTFOUND	t	1
3	https://static2.bigstockphoto.com/5/2/6/large1500/62597684.jpg	t	t	0-1-1-0-d091a564f29611fe42300.jpeg	-3007: ENOTFOUND	t	1
4	https://static2.bigstockphoto.com/5/2/6/large1500/62597684.jpg	t	f	0-1-1-0-963ba439c67c0fc1978c1.jpg	-3007: ENOTFOUND	t	1
\.


--
-- Data for Name: instance_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.instance_types (id, title) FROM stdin;
1	Type
2	Brand
3	Collection
4	Product
5	Offer
6	Property
7	Price type
8	Store
9	Relation
\.


--
-- Data for Name: instance_versions; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.instance_versions (company, catalog, instance_type, instance, version, deleted) FROM stdin;
1	1	9	1	1	f
1	0	7	1	2	f
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

COPY public.offer_amounts (offer, store, amount, changed_at, version) FROM stdin;
2	1	40.560000	2024-04-18 04:22:35.851778+03	1
12	1	7.000000	2024-04-23 02:51:06.407777+03	2
\.


--
-- Data for Name: offer_prices; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offer_prices (offer, price_type, value, currency, last_change, updated_at, index, changed_at, deleted, version) FROM stdin;
1	1	3.16	16	-28.94	2024-04-23 00:55:20.547+03	297.33	2024-04-23 00:55:20.329963+03	f	1
5	1	2.16	16	0.00	2024-04-23 00:58:17.91+03	203.24	2024-04-23 00:58:17.838802+03	f	4
\.


--
-- Data for Name: offer_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.offer_property_values (offer, property, "order", value) FROM stdin;
\.


--
-- Data for Name: oo_relation_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.oo_relation_values (relation, source, target, version, deleted, changed_at) FROM stdin;
\.


--
-- Data for Name: op_relation_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.op_relation_values (relation, source, target, version, deleted, changed_at) FROM stdin;
\.


--
-- Data for Name: options_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.options_property_values (property, value, hash) FROM stdin;
6	24	ooIhiyxiF7rZjh5pf9o91Q6+WSkXyrYuPMUQgRJLdpE=
6	25	zLK33O7hYjy+3dkxhSUNgerG3FgNw2MXCE1MT8/ggXg=
\.


--
-- Data for Name: po_relation_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.po_relation_values (relation, source, target, version, deleted, changed_at) FROM stdin;
\.


--
-- Data for Name: pp_relation_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.pp_relation_values (relation, source, target, version, deleted, changed_at) FROM stdin;
1	3	4	1	f	2024-04-25 05:21:14.525772+03
1	4	3	2	f	2024-04-25 05:21:14.525772+03
1	5	4	46	t	2024-04-26 01:06:39.035808+03
1	4	5	47	t	2024-04-26 01:06:39.035808+03
1	5	3	48	f	2024-04-26 01:12:09.810029+03
1	3	5	6	f	2024-04-25 05:35:31.417377+03
\.


--
-- Data for Name: price_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.price_types (id, company, title, display_currency, base_currency) FROM stdin;
1	1	Оптовая	3	2
\.


--
-- Data for Name: product_prices; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_prices (product, price_type, value, currency, last_change, updated_at, index, changed_at, deleted, version) FROM stdin;
4	1	4.00	16	-188.18	2024-04-23 00:23:27.97+03	376.37	2024-04-23 00:23:27.793011+03	f	1
5	1	6.00	16	94.09	2024-04-23 00:24:11.47+03	564.55	2024-04-23 00:24:11.367968+03	f	2
1	1	6.47	16	422.34	2024-04-23 00:24:34.997+03	608.78	2024-04-23 00:24:34.918384+03	f	3
\.


--
-- Data for Name: product_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_property_values (product, property, "order", value) FROM stdin;
4	8	0	34
5	8	0	35
\.


--
-- Data for Name: product_relations; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.product_relations (id, catalog, title, kind, "symmetric") FROM stdin;
1	1	get	1	t
\.


--
-- Data for Name: products_relation_kinds; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.products_relation_kinds (id, title) FROM stdin;
1	Product to product
2	Product to offer
3	Offer to product
4	Offer to offer
\.


--
-- Data for Name: property_in_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_in_types (type, property, scheme) FROM stdin;
8	6	{"value": {"kind": 3}}
8	5	{"value": {"kind": 3}}
9	4	{"value": {"kind": 5, "unitsGroup": 2, "storageUnit": 4}}
8	8	{"file": {"kind": 9}, "title": {"kind": 3}}
\.


--
-- Data for Name: property_primitives; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_primitives (id, title) FROM stdin;
1	int
2	decimal
3	short text
4	long text
5	int with unit
6	decimal with unit
7	file
8	Boolean
9	Image
\.


--
-- Data for Name: property_types; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_types (id, title, scheme, catalog) FROM stdin;
1	Short text	{"value": {"kind":3, "index":true}}	\N
7	Decimal with unit	{"value": {"kind":6, "index":true}}	\N
6	Int with unit	{"value": {"kind":5, "index":true}}	\N
5	Long text	{"value": {"kind":4, "index":false}}	\N
9	File	{"file":{"kind": 7, "index": false}, "title": {"kind":3, "index": false}}	\N
2	Boolean	{"value": {"kind":8, "index":true}}	\N
8	Image	{"file":{"kind": 9, "index": false}, "title": {"kind":3, "index": false}}	\N
\.


--
-- Data for Name: property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.property_values (value_key, type, value) FROM stdin;
18	1	{"value": "test"}
19	7	{"value": 7.3, "valueUnit": 3, "valueIndex": 0.0073}
20	6	{"value": 800, "valueUnit": 4, "valueIndex": 800}
21	1	{"value": "abc"}
22	1	{"value": "def"}
24	1	{"value": "ger"}
25	1	{"value": "hop"}
26	1	{"value": "ger"}
27	2	{"value": true}
34	8	{"file": "0-1-1-0-ff17f6baff7855f820ddf.png", "title": "yopta", "fileExt": "png"}
35	8	{"file": {}, "title": "hou"}
\.


--
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates ("from", "to", source, rate, updated_at) FROM stdin;
2	45	1	1.640411875	2024-04-19 01:00:00.739+03
3	2	1	60.670700000	2024-04-19 01:00:00.739+03
2	3	1	0.016482421	2024-04-19 01:00:00.739+03
4	2	1	55.348400000	2024-04-19 01:00:00.739+03
2	4	1	0.018067370	2024-04-19 01:00:00.739+03
5	2	1	117.144800000	2024-04-19 01:00:00.739+03
2	5	1	0.008536444	2024-04-19 01:00:00.739+03
6	2	1	0.238770000	2024-04-19 01:00:00.739+03
2	6	1	4.188130837	2024-04-19 01:00:00.739+03
7	2	1	28.724300000	2024-04-19 01:00:00.739+03
2	7	1	0.034813729	2024-04-19 01:00:00.739+03
8	2	1	51.178000000	2024-04-19 01:00:00.739+03
2	8	1	0.019539646	2024-04-19 01:00:00.739+03
9	2	1	17.933900000	2024-04-19 01:00:00.739+03
2	9	1	0.055760320	2024-04-19 01:00:00.739+03
10	2	1	0.255158000	2024-04-19 01:00:00.739+03
2	10	1	3.919140297	2024-04-19 01:00:00.739+03
11	2	1	0.003883130	2024-04-19 01:00:00.739+03
2	11	1	257.524213714	2024-04-19 01:00:00.739+03
12	2	1	12.035300000	2024-04-19 01:00:00.739+03
2	12	1	0.083088913	2024-04-19 01:00:00.739+03
13	2	1	35.170700000	2024-04-19 01:00:00.739+03
2	13	1	0.028432758	2024-04-19 01:00:00.739+03
14	2	1	13.415700000	2024-04-19 01:00:00.739+03
2	14	1	0.074539532	2024-04-19 01:00:00.739+03
15	2	1	25.620700000	2024-04-19 01:00:00.739+03
2	15	1	0.039030940	2024-04-19 01:00:00.739+03
16	2	1	94.092200000	2024-04-19 01:00:00.739+03
2	16	1	0.010627874	2024-04-19 01:00:00.739+03
17	2	1	100.531600000	2024-04-19 01:00:00.739+03
2	28	1	0.116848093	2024-04-19 01:00:00.739+03
29	2	1	23.198800000	2024-04-19 01:00:00.739+03
2	29	1	0.043105678	2024-04-19 01:00:00.739+03
30	2	1	20.180600000	2024-04-19 01:00:00.739+03
2	30	1	0.049552541	2024-04-19 01:00:00.739+03
31	2	1	123.740700000	2024-04-19 01:00:00.739+03
2	31	1	0.008081415	2024-04-19 01:00:00.739+03
32	2	1	69.251600000	2024-04-19 01:00:00.739+03
2	32	1	0.014440100	2024-04-19 01:00:00.739+03
33	2	1	8.613580000	2024-04-19 01:00:00.739+03
2	33	1	0.116095746	2024-04-19 01:00:00.739+03
34	2	1	2.560400000	2024-04-19 01:00:00.739+03
2	34	1	0.390563974	2024-04-19 01:00:00.739+03
44	2	1	0.068535400	2024-04-19 01:00:00.739+03
2	44	1	14.590999688	2024-04-19 01:00:00.739+03
45	2	1	0.609603000	2024-04-19 01:00:00.739+03
2	17	1	0.009947121	2024-04-19 01:00:00.739+03
18	2	1	1.946570000	2024-04-19 01:00:00.739+03
2	18	1	0.513724140	2024-04-19 01:00:00.739+03
19	2	1	1.126620000	2024-04-19 01:00:00.739+03
2	19	1	0.887610729	2024-04-19 01:00:00.739+03
20	2	1	0.005793850	2024-04-19 01:00:00.739+03
2	20	1	172.596805233	2024-04-19 01:00:00.739+03
21	2	1	0.209611000	2024-04-19 01:00:00.739+03
2	21	1	4.770741994	2024-04-19 01:00:00.739+03
22	2	1	68.212400000	2024-04-19 01:00:00.739+03
2	22	1	0.014660091	2024-04-19 01:00:00.739+03
23	2	1	25.849500000	2024-04-19 01:00:00.739+03
2	23	1	0.038685468	2024-04-19 01:00:00.739+03
24	2	1	1.057140000	2024-04-19 01:00:00.739+03
2	24	1	0.945948503	2024-04-19 01:00:00.739+03
25	2	1	12.976000000	2024-04-19 01:00:00.739+03
2	25	1	0.077065351	2024-04-19 01:00:00.739+03
26	2	1	5.261960000	2024-04-19 01:00:00.739+03
2	26	1	0.190043254	2024-04-19 01:00:00.739+03
27	2	1	55.679100000	2024-04-19 01:00:00.739+03
2	27	1	0.017960060	2024-04-19 01:00:00.739+03
28	2	1	8.558120000	2024-04-19 01:00:00.739+03
35	2	1	2.895870000	2024-04-19 01:00:00.739+03
2	35	1	0.345319369	2024-04-19 01:00:00.739+03
36	2	1	26.883500000	2024-04-19 01:00:00.739+03
2	36	1	0.037197538	2024-04-19 01:00:00.739+03
37	2	1	0.007411780	2024-04-19 01:00:00.739+03
2	37	1	134.920356514	2024-04-19 01:00:00.739+03
38	2	1	2.379360000	2024-04-19 01:00:00.739+03
2	38	1	0.420281084	2024-04-19 01:00:00.739+03
39	2	1	3.976340000	2024-04-19 01:00:00.739+03
2	39	1	0.251487549	2024-04-19 01:00:00.739+03
40	2	1	8.570310000	2024-04-19 01:00:00.739+03
2	40	1	0.116681894	2024-04-19 01:00:00.739+03
41	2	1	103.568700000	2024-04-19 01:00:00.739+03
2	41	1	0.009655427	2024-04-19 01:00:00.739+03
42	2	1	0.857886000	2024-04-19 01:00:00.739+03
2	42	1	1.165656043	2024-04-19 01:00:00.739+03
43	2	1	4.943450000	2024-04-19 01:00:00.739+03
2	43	1	0.202287876	2024-04-19 01:00:00.739+03
\.


--
-- Data for Name: rates_history; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates_history ("from", "to", source, date, rate) FROM stdin;
3	2	1	2024-04-02	60.284700000
2	3	1	2024-04-02	0.016587957
4	2	1	2024-04-02	54.289100000
2	4	1	2024-04-02	0.018419904
5	2	1	2024-04-02	116.554800000
2	5	1	2024-04-02	0.008579655
6	2	1	2024-04-02	0.235455000
2	6	1	2024-04-02	4.247096048
7	2	1	2024-04-02	28.399100000
2	7	1	2024-04-02	0.035212383
8	2	1	2024-04-02	51.014800000
2	8	1	2024-04-02	0.019602155
9	2	1	2024-04-02	18.473400000
2	9	1	2024-04-02	0.054131887
10	2	1	2024-04-02	0.251249000
2	10	1	2024-04-02	3.980115344
11	2	1	2024-04-02	0.003844830
2	11	1	2024-04-02	260.089522814
12	2	1	2024-04-02	11.815600000
2	12	1	2024-04-02	0.084633874
13	2	1	2024-04-02	34.241600000
2	13	1	2024-04-02	0.029204243
14	2	1	2024-04-02	13.384300000
2	14	1	2024-04-02	0.074714404
15	2	1	2024-04-02	25.130400000
2	15	1	2024-04-02	0.039792443
16	2	1	2024-04-02	92.291400000
2	16	1	2024-04-02	0.010835246
17	2	1	2024-04-02	99.566100000
2	17	1	2024-04-02	0.010043579
18	2	1	2024-04-02	1.955660000
2	18	1	2024-04-02	0.511336326
19	2	1	2024-04-02	1.106960000
2	19	1	2024-04-02	0.903375009
20	2	1	2024-04-02	0.005814360
2	20	1	2024-04-02	171.987974601
21	2	1	2024-04-02	0.206570000
2	21	1	2024-04-02	4.840974004
22	2	1	2024-04-02	68.111700000
2	22	1	2024-04-02	0.014681765
23	2	1	2024-04-02	25.354800000
2	23	1	2024-04-02	0.039440264
24	2	1	2024-04-02	1.032260000
2	24	1	2024-04-02	0.968748184
25	2	1	2024-04-02	12.687200000
2	25	1	2024-04-02	0.078819598
26	2	1	2024-04-02	5.232530000
2	26	1	2024-04-02	0.191112139
27	2	1	2024-04-02	55.291800000
2	27	1	2024-04-02	0.018085864
28	2	1	2024-04-02	8.544630000
2	28	1	2024-04-02	0.117032569
29	2	1	2024-04-02	23.138800000
2	29	1	2024-04-02	0.043217453
30	2	1	2024-04-02	20.031100000
2	30	1	2024-04-02	0.049922371
31	2	1	2024-04-02	122.198400000
2	31	1	2024-04-02	0.008183413
32	2	1	2024-04-02	68.435000000
2	32	1	2024-04-02	0.014612406
33	2	1	2024-04-02	8.427590000
2	33	1	2024-04-02	0.118657884
34	2	1	2024-04-02	2.538690000
2	34	1	2024-04-02	0.393903943
35	2	1	2024-04-02	2.856040000
2	35	1	2024-04-02	0.350135152
36	2	1	2024-04-02	26.369000000
2	36	1	2024-04-02	0.037923319
37	2	1	2024-04-02	0.007308440
2	37	1	2024-04-02	136.828105588
38	2	1	2024-04-02	2.366600000
2	38	1	2024-04-02	0.422547114
39	2	1	2024-04-02	3.941890000
2	39	1	2024-04-02	0.253685415
40	2	1	2024-04-02	8.657370000
2	40	1	2024-04-02	0.115508520
3	2	1	2024-03-31	60.333500000
2	3	1	2024-03-31	0.016574540
4	2	1	2024-03-31	54.332900000
2	4	1	2024-03-31	0.018405055
5	2	1	2024-03-31	116.649000000
2	5	1	2024-03-31	0.008572727
6	2	1	2024-03-31	0.234861000
2	6	1	2024-03-31	4.257837615
7	2	1	2024-03-31	28.400200000
2	7	1	2024-03-31	0.035211020
8	2	1	2024-03-31	51.056000000
2	8	1	2024-03-31	0.019586337
9	2	1	2024-03-31	18.488400000
2	9	1	2024-03-31	0.054087969
10	2	1	2024-03-31	0.251452000
2	10	1	2024-03-31	3.976902152
11	2	1	2024-03-31	0.003848100
2	11	1	2024-03-31	259.868506536
12	2	1	2024-03-31	11.823600000
2	12	1	2024-03-31	0.084576609
13	2	1	2024-03-31	34.237500000
2	13	1	2024-03-31	0.029207740
14	2	1	2024-03-31	13.395100000
2	14	1	2024-03-31	0.074654165
15	2	1	2024-03-31	25.150700000
2	15	1	2024-03-31	0.039760325
16	2	1	2024-03-31	92.366000000
2	16	1	2024-03-31	0.010826495
17	2	1	2024-03-31	99.529900000
2	17	1	2024-03-31	0.010047232
18	2	1	2024-03-31	1.948770000
2	18	1	2024-03-31	0.513144188
19	2	1	2024-03-31	1.107850000
2	19	1	2024-03-31	0.902649276
20	2	1	2024-03-31	0.005826410
2	20	1	2024-03-31	171.632274419
21	2	1	2024-03-31	0.206105000
2	21	1	2024-03-31	4.851895878
22	2	1	2024-03-31	68.166800000
2	22	1	2024-03-31	0.014669898
23	2	1	2024-03-31	25.375300000
2	23	1	2024-03-31	0.039408401
24	2	1	2024-03-31	1.032360000
2	24	1	2024-03-31	0.968654345
25	2	1	2024-03-31	12.671000000
2	25	1	2024-03-31	0.078920369
2	28	1	2024-03-31	0.116938002
29	2	1	2024-03-31	23.157500000
2	29	1	2024-03-31	0.043182554
30	2	1	2024-03-31	20.045600000
2	30	1	2024-03-31	0.049886259
31	2	1	2024-03-31	122.239900000
2	31	1	2024-03-31	0.008180635
32	2	1	2024-03-31	68.541100000
2	32	1	2024-03-31	0.014589786
33	2	1	2024-03-31	8.434400000
2	33	1	2024-03-31	0.118562079
34	2	1	2024-03-31	2.534050000
2	34	1	2024-03-31	0.394625205
44	2	1	2024-03-31	0.068561500
2	44	1	2024-03-31	14.585445184
45	2	1	2024-03-31	0.610684000
2	45	1	2024-03-31	1.637508106
26	2	1	2024-03-31	5.234710000
2	26	1	2024-03-31	0.191032550
27	2	1	2024-03-31	55.336500000
2	27	1	2024-03-31	0.018071255
28	2	1	2024-03-31	8.551540000
35	2	1	2024-03-31	2.860630000
2	35	1	2024-03-31	0.349573346
36	2	1	2024-03-31	26.390300000
2	36	1	2024-03-31	0.037892711
37	2	1	2024-03-31	0.007318970
2	37	1	2024-03-31	136.631247293
38	2	1	2024-03-31	2.354990000
2	38	1	2024-03-31	0.424630253
39	2	1	2024-03-31	3.945070000
2	39	1	2024-03-31	0.253480927
40	2	1	2024-03-31	8.664370000
2	40	1	2024-03-31	0.115415200
41	2	1	2024-03-31	101.926700000
2	41	1	2024-03-31	0.009810972
42	2	1	2024-03-31	0.849845000
2	42	1	2024-03-31	1.176685160
43	2	1	2024-03-31	4.863260000
2	43	1	2024-03-31	0.205623388
41	2	1	2024-04-02	101.844400000
2	41	1	2024-04-02	0.009818900
42	2	1	2024-04-02	0.850155000
2	42	1	2024-04-02	1.176256094
43	2	1	2024-04-02	4.859330000
2	43	1	2024-04-02	0.205789687
44	2	1	2024-04-02	0.068394400
2	44	1	2024-04-02	14.621080088
45	2	1	2024-04-02	0.609667000
2	45	1	2024-04-02	1.640239672
3	2	1	2024-04-04	60.228500000
2	3	1	2024-04-04	0.016603435
4	2	1	2024-04-04	54.346600000
2	4	1	2024-04-04	0.018400415
5	2	1	2024-04-04	116.105500000
2	5	1	2024-04-04	0.008612856
6	2	1	2024-04-04	0.237066000
2	6	1	2024-04-04	4.218234584
7	2	1	2024-04-04	28.342900000
2	7	1	2024-04-04	0.035282205
8	2	1	2024-04-04	50.775900000
2	8	1	2024-04-04	0.019694383
9	2	1	2024-04-04	18.304900000
2	9	1	2024-04-04	0.054630181
10	2	1	2024-04-04	0.252948000
2	10	1	2024-04-04	3.953381723
11	2	1	2024-04-04	0.003846340
2	11	1	2024-04-04	259.987416609
12	2	1	2024-04-04	11.822000000
2	12	1	2024-04-04	0.084588056
13	2	1	2024-04-04	34.455600000
2	13	1	2024-04-04	0.029022858
14	2	1	2024-04-04	13.315400000
2	14	1	2024-04-04	0.075101011
15	2	1	2024-04-04	25.157000000
2	15	1	2024-04-04	0.039750368
16	2	1	2024-04-04	92.389200000
2	16	1	2024-04-04	0.010823776
17	2	1	2024-04-04	99.427700000
2	17	1	2024-04-04	0.010057559
18	2	1	2024-04-04	1.949230000
2	18	1	2024-04-04	0.513023091
19	2	1	2024-04-04	1.107510000
2	19	1	2024-04-04	0.902926384
20	2	1	2024-04-04	0.005798240
2	20	1	2024-04-04	172.466127653
21	2	1	2024-04-04	0.206442000
2	21	1	2024-04-04	4.843975548
22	2	1	2024-04-04	68.073400000
2	22	1	2024-04-04	0.014690026
23	2	1	2024-04-04	25.381600000
2	23	1	2024-04-04	0.039398619
24	2	1	2024-04-04	1.034010000
2	24	1	2024-04-04	0.967108635
25	2	1	2024-04-04	12.714500000
2	25	1	2024-04-04	0.078650360
26	2	1	2024-04-04	5.224130000
2	26	1	2024-04-04	0.191419433
27	2	1	2024-04-04	55.059300000
2	27	1	2024-04-04	0.018162236
28	2	1	2024-04-04	8.482140000
2	28	1	2024-04-04	0.117894777
29	2	1	2024-04-04	23.188300000
2	29	1	2024-04-04	0.043125197
30	2	1	2024-04-04	20.024100000
2	30	1	2024-04-04	0.049939823
31	2	1	2024-04-04	122.077500000
2	31	1	2024-04-04	0.008191518
32	2	1	2024-04-04	68.385800000
2	32	1	2024-04-04	0.014622919
33	2	1	2024-04-04	8.432520000
2	33	1	2024-04-04	0.118588512
34	2	1	2024-04-04	2.519550000
2	34	1	2024-04-04	0.396896271
35	2	1	2024-04-04	2.872870000
2	35	1	2024-04-04	0.348083972
36	2	1	2024-04-04	26.396900000
2	36	1	2024-04-04	0.037883236
37	2	1	2024-04-04	0.007313020
2	37	1	2024-04-04	136.742412847
38	2	1	2024-04-04	2.349460000
2	38	1	2024-04-04	0.425629719
39	2	1	2024-04-04	3.929110000
2	39	1	2024-04-04	0.254510563
40	2	1	2024-04-04	8.592620000
2	40	1	2024-04-04	0.116378939
41	2	1	2024-04-04	101.716600000
2	41	1	2024-04-04	0.009831237
42	2	1	2024-04-04	0.850141000
2	42	1	2024-04-04	1.176275465
43	2	1	2024-04-04	4.900450000
2	43	1	2024-04-04	0.204062892
44	2	1	2024-04-04	0.068492300
2	44	1	2024-04-04	14.600181334
45	2	1	2024-04-04	0.609749000
2	45	1	2024-04-04	1.640019090
3	2	1	2024-04-05	60.801800000
2	3	1	2024-04-05	0.016446882
4	2	1	2024-04-05	54.297500000
2	4	1	2024-04-05	0.018417054
5	2	1	2024-04-05	116.480700000
2	5	1	2024-04-05	0.008585113
6	2	1	2024-04-05	0.237540000
2	6	1	2024-04-05	4.209817294
7	2	1	2024-04-05	28.360800000
2	7	1	2024-04-05	0.035259936
8	2	1	2024-04-05	50.890600000
2	8	1	2024-04-05	0.019649994
9	2	1	2024-04-05	18.198700000
2	9	1	2024-04-05	0.054948980
10	2	1	2024-04-05	0.256035000
2	10	1	2024-04-05	3.905716015
11	2	1	2024-04-05	0.003840000
2	11	1	2024-04-05	260.416666667
12	2	1	2024-04-05	11.811400000
2	12	1	2024-04-05	0.084663969
13	2	1	2024-04-05	34.391100000
2	13	1	2024-04-05	0.029077290
14	2	1	2024-04-05	13.344200000
2	14	1	2024-04-05	0.074938925
15	2	1	2024-04-05	25.134300000
2	15	1	2024-04-05	0.039786268
16	2	1	2024-04-05	92.305800000
2	16	1	2024-04-05	0.010833555
17	2	1	2024-04-05	100.066800000
2	17	1	2024-04-05	0.009993324
18	2	1	2024-04-05	1.948250000
2	18	1	2024-04-05	0.513281150
19	2	1	2024-04-05	1.106150000
2	19	1	2024-04-05	0.904036523
20	2	1	2024-04-05	0.005797010
2	20	1	2024-04-05	172.502721230
21	2	1	2024-04-05	0.206542000
2	21	1	2024-04-05	4.841630274
22	2	1	2024-04-05	68.187800000
2	22	1	2024-04-05	0.014665380
23	2	1	2024-04-05	25.358700000
2	23	1	2024-04-05	0.039434198
24	2	1	2024-04-05	1.033080000
2	24	1	2024-04-05	0.967979247
25	2	1	2024-04-05	12.714300000
2	25	1	2024-04-05	0.078651597
26	2	1	2024-04-05	5.204310000
2	26	1	2024-04-05	0.192148431
27	2	1	2024-04-05	55.605000000
2	27	1	2024-04-05	0.017983994
28	2	1	2024-04-05	8.537740000
2	28	1	2024-04-05	0.117127015
29	2	1	2024-04-05	23.359700000
2	29	1	2024-04-05	0.042808769
30	2	1	2024-04-05	20.170400000
2	30	1	2024-04-05	0.049577599
31	2	1	2024-04-05	122.095700000
2	31	1	2024-04-05	0.008190297
32	2	1	2024-04-05	68.476100000
2	32	1	2024-04-05	0.014603635
33	2	1	2024-04-05	8.426750000
2	33	1	2024-04-05	0.118669713
34	2	1	2024-04-05	2.516790000
2	34	1	2024-04-05	0.397331522
35	2	1	2024-04-05	2.887440000
2	35	1	2024-04-05	0.346327543
36	2	1	2024-04-05	26.373100000
2	36	1	2024-04-05	0.037917423
37	2	1	2024-04-05	0.007286530
2	37	1	2024-04-05	137.239536515
38	2	1	2024-04-05	2.355020000
2	38	1	2024-04-05	0.424624844
39	2	1	2024-04-05	3.957890000
2	39	1	2024-04-05	0.252659877
40	2	1	2024-04-05	8.598990000
2	40	1	2024-04-05	0.116292727
41	2	1	2024-04-05	101.905300000
2	41	1	2024-04-05	0.009813032
42	2	1	2024-04-05	0.854501000
2	42	1	2024-04-05	1.170273645
43	2	1	2024-04-05	4.958570000
2	43	1	2024-04-05	0.201671046
44	2	1	2024-04-05	0.068521900
2	44	1	2024-04-05	14.593874367
45	2	1	2024-04-05	0.608797000
2	45	1	2024-04-05	1.642583653
3	2	1	2024-04-06	60.735500000
2	3	1	2024-04-06	0.016464835
4	2	1	2024-04-06	54.362100000
2	4	1	2024-04-06	0.018395169
5	2	1	2024-04-06	117.072000000
2	5	1	2024-04-06	0.008541752
6	2	1	2024-04-06	0.237896000
2	6	1	2024-04-06	4.203517503
7	2	1	2024-04-06	28.397100000
2	7	1	2024-04-06	0.035214863
8	2	1	2024-04-06	51.277000000
2	8	1	2024-04-06	0.019501921
9	2	1	2024-04-06	18.397000000
2	9	1	2024-04-06	0.054356689
10	2	1	2024-04-06	0.256439000
2	10	1	2024-04-06	3.899562859
11	2	1	2024-04-06	0.003844560
2	11	1	2024-04-06	260.107788668
12	2	1	2024-04-06	11.826900000
2	12	1	2024-04-06	0.084553011
13	2	1	2024-04-06	34.439700000
2	13	1	2024-04-06	0.029036258
14	2	1	2024-04-06	13.445600000
2	14	1	2024-04-06	0.074373773
15	2	1	2024-04-06	25.164200000
2	15	1	2024-04-06	0.039738994
16	2	1	2024-04-06	92.415500000
2	16	1	2024-04-06	0.010820696
17	2	1	2024-04-06	100.125900000
2	17	1	2024-04-06	0.009987426
18	2	1	2024-04-06	1.950570000
2	18	1	2024-04-06	0.512670655
19	2	1	2024-04-06	1.108000000
2	19	1	2024-04-06	0.902527076
20	2	1	2024-04-06	0.005809740
2	20	1	2024-04-06	172.124742243
21	2	1	2024-04-06	0.206982000
2	21	1	2024-04-06	4.831337991
22	2	1	2024-04-06	68.435600000
2	22	1	2024-04-06	0.014612278
23	2	1	2024-04-06	25.388900000
2	23	1	2024-04-06	0.039387291
24	2	1	2024-04-06	1.034480000
2	24	1	2024-04-06	0.966669244
25	2	1	2024-04-06	12.760200000
2	25	1	2024-04-06	0.078368678
26	2	1	2024-04-06	5.213000000
2	26	1	2024-04-06	0.191828122
27	2	1	2024-04-06	55.726500000
2	27	1	2024-04-06	0.017944784
28	2	1	2024-04-06	8.636320000
2	28	1	2024-04-06	0.115790059
29	2	1	2024-04-06	23.354400000
2	29	1	2024-04-06	0.042818484
30	2	1	2024-04-06	20.162600000
2	30	1	2024-04-06	0.049596778
31	2	1	2024-04-06	122.617800000
2	31	1	2024-04-06	0.008155423
32	2	1	2024-04-06	68.476200000
2	32	1	2024-04-06	0.014603614
33	2	1	2024-04-06	8.436150000
2	33	1	2024-04-06	0.118537485
34	2	1	2024-04-06	2.513200000
2	34	1	2024-04-06	0.397899093
35	2	1	2024-04-06	2.899920000
2	35	1	2024-04-06	0.344837099
36	2	1	2024-04-06	26.404400000
2	36	1	2024-04-06	0.037872476
37	2	1	2024-04-06	0.007288250
2	37	1	2024-04-06	137.207148492
38	2	1	2024-04-06	2.368410000
2	38	1	2024-04-06	0.422224193
39	2	1	2024-04-06	3.962250000
2	39	1	2024-04-06	0.252381854
40	2	1	2024-04-06	8.712850000
2	40	1	2024-04-06	0.114773008
41	2	1	2024-04-06	102.297400000
2	41	1	2024-04-06	0.009775420
42	2	1	2024-04-06	0.854495000
2	42	1	2024-04-06	1.170281862
43	2	1	2024-04-06	4.950790000
2	43	1	2024-04-06	0.201987966
44	2	1	2024-04-06	0.068314200
2	44	1	2024-04-06	14.638245050
45	2	1	2024-04-06	0.612348000
2	45	1	2024-04-06	1.633058326
3	2	1	2024-04-09	61.286800000
2	3	1	2024-04-09	0.016316727
4	2	1	2024-04-09	54.556600000
2	4	1	2024-04-09	0.018329588
5	2	1	2024-04-09	117.296200000
2	5	1	2024-04-09	0.008525425
6	2	1	2024-04-09	0.238049000
2	6	1	2024-04-09	4.200815798
7	2	1	2024-04-09	28.492600000
2	7	1	2024-04-09	0.035096832
8	2	1	2024-04-09	51.323000000
2	8	1	2024-04-09	0.019484442
9	2	1	2024-04-09	18.395500000
2	9	1	2024-04-09	0.054361121
10	2	1	2024-04-09	0.259010000
2	10	1	2024-04-09	3.860854793
11	2	1	2024-04-09	0.003858480
2	11	1	2024-04-09	259.169413862
12	2	1	2024-04-09	11.864700000
2	12	1	2024-04-09	0.084283631
13	2	1	2024-04-09	34.636600000
2	13	1	2024-04-09	0.028871194
14	2	1	2024-04-09	13.457900000
2	14	1	2024-04-09	0.074305798
15	2	1	2024-04-09	25.254300000
2	15	1	2024-04-09	0.039597217
16	2	1	2024-04-09	92.746300000
2	16	1	2024-04-09	0.010782101
17	2	1	2024-04-09	100.747300000
2	17	1	2024-04-09	0.009925824
18	2	1	2024-04-09	1.948820000
2	18	1	2024-04-09	0.513131023
19	2	1	2024-04-09	1.113170000
2	19	1	2024-04-09	0.898335385
20	2	1	2024-04-09	0.005830530
2	20	1	2024-04-09	171.510994712
21	2	1	2024-04-09	0.207975000
2	21	1	2024-04-09	4.808270225
22	2	1	2024-04-09	68.286200000
2	22	1	2024-04-09	0.014644247
23	2	1	2024-04-09	25.479800000
2	23	1	2024-04-09	0.039246776
24	2	1	2024-04-09	1.040690000
2	24	1	2024-04-09	0.960900941
25	2	1	2024-04-09	12.800400000
2	25	1	2024-04-09	0.078122559
26	2	1	2024-04-09	5.241210000
2	26	1	2024-04-09	0.190795637
27	2	1	2024-04-09	56.074400000
2	27	1	2024-04-09	0.017833450
28	2	1	2024-04-09	8.660510000
2	28	1	2024-04-09	0.115466641
29	2	1	2024-04-09	23.645900000
2	29	1	2024-04-09	0.042290630
30	2	1	2024-04-09	20.281700000
2	30	1	2024-04-09	0.049305532
31	2	1	2024-04-09	122.940800000
2	31	1	2024-04-09	0.008133996
32	2	1	2024-04-09	68.813100000
2	32	1	2024-04-09	0.014532117
33	2	1	2024-04-09	8.474780000
2	33	1	2024-04-09	0.117997163
34	2	1	2024-04-09	2.536960000
2	34	1	2024-04-09	0.394172553
35	2	1	2024-04-09	2.895170000
2	35	1	2024-04-09	0.345402861
36	2	1	2024-04-09	26.498900000
2	36	1	2024-04-09	0.037737416
37	2	1	2024-04-09	0.007316750
2	37	1	2024-04-09	136.672703044
38	2	1	2024-04-09	2.378830000
2	38	1	2024-04-09	0.420374722
39	2	1	2024-04-09	3.971490000
2	39	1	2024-04-09	0.251794666
40	2	1	2024-04-09	8.753380000
2	40	1	2024-04-09	0.114241584
41	2	1	2024-04-09	102.538800000
2	41	1	2024-04-09	0.009752406
42	2	1	2024-04-09	0.860003000
2	42	1	2024-04-09	1.162786641
43	2	1	2024-04-09	5.006300000
2	43	1	2024-04-09	0.199748317
44	2	1	2024-04-09	0.068452500
2	44	1	2024-04-09	14.608670246
45	2	1	2024-04-09	0.610535000
2	45	1	2024-04-09	1.637907737
3	2	1	2024-04-11	61.720800000
2	3	1	2024-04-11	0.016201993
4	2	1	2024-04-11	54.835200000
2	4	1	2024-04-11	0.018236461
5	2	1	2024-04-11	118.156100000
2	5	1	2024-04-11	0.008463380
6	2	1	2024-04-11	0.238799000
2	6	1	2024-04-11	4.187622226
7	2	1	2024-04-11	28.582800000
2	7	1	2024-04-11	0.034986076
8	2	1	2024-04-11	51.794800000
2	8	1	2024-04-11	0.019306957
9	2	1	2024-04-11	18.615300000
2	9	1	2024-04-11	0.053719252
10	2	1	2024-04-11	0.259318000
2	10	1	2024-04-11	3.856269137
11	2	1	2024-04-11	0.003878340
2	11	1	2024-04-11	257.842272725
12	2	1	2024-04-11	11.922200000
2	12	1	2024-04-11	0.083877137
13	2	1	2024-04-11	34.813400000
2	13	1	2024-04-11	0.028724572
14	2	1	2024-04-11	13.581200000
2	14	1	2024-04-11	0.073631196
15	2	1	2024-04-11	25.383200000
2	15	1	2024-04-11	0.039396136
16	2	1	2024-04-11	93.219800000
2	16	1	2024-04-11	0.010727335
17	2	1	2024-04-11	101.233300000
2	17	1	2024-04-11	0.009878172
18	2	1	2024-04-11	1.958770000
2	18	1	2024-04-11	0.510524462
19	2	1	2024-04-11	1.120090000
2	19	1	2024-04-11	0.892785401
20	2	1	2024-04-11	0.005860300
2	20	1	2024-04-11	170.639728342
21	2	1	2024-04-11	0.208947000
2	21	1	2024-04-11	4.785902645
22	2	1	2024-04-11	68.655000000
2	22	1	2024-04-11	0.014565582
23	2	1	2024-04-11	25.609800000
2	23	1	2024-04-11	0.039047552
24	2	1	2024-04-11	1.046000000
2	24	1	2024-04-11	0.956022945
25	2	1	2024-04-11	12.873000000
2	25	1	2024-04-11	0.077681970
26	2	1	2024-04-11	5.277330000
2	26	1	2024-04-11	0.189489761
27	2	1	2024-04-11	56.486500000
2	27	1	2024-04-11	0.017703345
28	2	1	2024-04-11	8.738180000
2	28	1	2024-04-11	0.114440307
29	2	1	2024-04-11	23.741800000
2	29	1	2024-04-11	0.042119806
30	2	1	2024-04-11	20.376800000
2	30	1	2024-04-11	0.049075419
31	2	1	2024-04-11	123.737200000
2	31	1	2024-04-11	0.008081644
32	2	1	2024-04-11	69.164400000
2	32	1	2024-04-11	0.014458305
33	2	1	2024-04-11	8.518050000
2	33	1	2024-04-11	0.117397761
34	2	1	2024-04-11	2.566060000
2	34	1	2024-04-11	0.389702501
35	2	1	2024-04-11	2.909950000
2	35	1	2024-04-11	0.343648516
36	2	1	2024-04-11	26.634200000
2	36	1	2024-04-11	0.037545712
37	2	1	2024-04-11	0.007354110
2	37	1	2024-04-11	135.978384876
38	2	1	2024-04-11	2.390590000
2	38	1	2024-04-11	0.418306778
39	2	1	2024-04-11	3.991600000
2	39	1	2024-04-11	0.250526105
40	2	1	2024-04-11	8.843080000
2	40	1	2024-04-11	0.113082772
41	2	1	2024-04-11	103.142100000
2	41	1	2024-04-11	0.009695362
42	2	1	2024-04-11	0.863993000
2	42	1	2024-04-11	1.157416785
43	2	1	2024-04-11	5.019210000
2	43	1	2024-04-11	0.199234541
44	2	1	2024-04-11	0.068802000
2	44	1	2024-04-11	14.534461208
45	2	1	2024-04-11	0.614299000
2	45	1	2024-04-11	1.627871769
3	2	1	2024-04-12	61.133300000
2	3	1	2024-04-12	0.016357697
4	2	1	2024-04-12	55.129200000
2	4	1	2024-04-12	0.018139208
5	2	1	2024-04-12	117.768000000
2	5	1	2024-04-12	0.008491271
6	2	1	2024-04-12	0.239410000
2	6	1	2024-04-12	4.176934965
7	2	1	2024-04-12	28.628900000
2	7	1	2024-04-12	0.034929739
8	2	1	2024-04-12	52.039000000
2	8	1	2024-04-12	0.019216357
9	2	1	2024-04-12	18.503000000
2	9	1	2024-04-12	0.054045290
10	2	1	2024-04-12	0.257613000
2	10	1	2024-04-12	3.881791680
11	2	1	2024-04-12	0.003897510
2	11	1	2024-04-12	256.574069085
12	2	1	2024-04-12	11.984600000
2	12	1	2024-04-12	0.083440415
13	2	1	2024-04-12	35.062900000
2	13	1	2024-04-12	0.028520174
14	2	1	2024-04-12	13.644400000
2	14	1	2024-04-12	0.073290141
15	2	1	2024-04-12	25.519300000
2	15	1	2024-04-12	0.039186028
16	2	1	2024-04-12	93.719600000
2	16	1	2024-04-12	0.010670127
17	2	1	2024-04-12	100.679300000
2	17	1	2024-04-12	0.009932528
18	2	1	2024-04-12	1.969270000
2	18	1	2024-04-12	0.507802384
19	2	1	2024-04-12	1.126100000
2	19	1	2024-04-12	0.888020602
20	2	1	2024-04-12	0.005891720
2	20	1	2024-04-12	169.729722390
21	2	1	2024-04-12	0.209593000
2	21	1	2024-04-12	4.771151708
22	2	1	2024-04-12	68.553600000
2	22	1	2024-04-12	0.014587126
23	2	1	2024-04-12	25.747100000
2	23	1	2024-04-12	0.038839326
24	2	1	2024-04-12	1.051610000
2	24	1	2024-04-12	0.950922871
25	2	1	2024-04-12	12.911900000
2	25	1	2024-04-12	0.077447936
26	2	1	2024-04-12	5.314320000
2	26	1	2024-04-12	0.188170829
27	2	1	2024-04-12	56.053700000
2	27	1	2024-04-12	0.017840036
28	2	1	2024-04-12	8.799470000
2	28	1	2024-04-12	0.113643208
29	2	1	2024-04-12	23.602800000
2	29	1	2024-04-12	0.042367855
30	2	1	2024-04-12	20.232200000
2	30	1	2024-04-12	0.049426162
31	2	1	2024-04-12	124.398700000
2	31	1	2024-04-12	0.008038669
32	2	1	2024-04-12	69.262900000
2	32	1	2024-04-12	0.014437744
33	2	1	2024-04-12	8.563720000
2	33	1	2024-04-12	0.116771683
34	2	1	2024-04-12	2.558410000
2	34	1	2024-04-12	0.390867766
35	2	1	2024-04-12	2.925560000
2	35	1	2024-04-12	0.341814900
36	2	1	2024-04-12	26.777000000
2	36	1	2024-04-12	0.037345483
37	2	1	2024-04-12	0.007393540
2	37	1	2024-04-12	135.253207530
38	2	1	2024-04-12	2.401640000
2	38	1	2024-04-12	0.416382139
39	2	1	2024-04-12	3.960090000
2	39	1	2024-04-12	0.252519513
40	2	1	2024-04-12	8.901080000
2	40	1	2024-04-12	0.112345918
41	2	1	2024-04-12	102.571500000
2	41	1	2024-04-12	0.009749297
42	2	1	2024-04-12	0.859812000
2	42	1	2024-04-12	1.163044945
43	2	1	2024-04-12	4.984950000
2	43	1	2024-04-12	0.200603817
44	2	1	2024-04-12	0.068704300
2	44	1	2024-04-12	14.555129737
45	2	1	2024-04-12	0.613107000
2	45	1	2024-04-12	1.631036671
3	2	1	2024-04-13	60.980200000
2	3	1	2024-04-13	0.016398766
4	2	1	2024-04-13	54.965800000
2	4	1	2024-04-13	0.018193131
5	2	1	2024-04-13	116.989300000
2	5	1	2024-04-13	0.008547790
6	2	1	2024-04-13	0.237259000
2	6	1	2024-04-13	4.214803232
7	2	1	2024-04-13	28.628000000
2	7	1	2024-04-13	0.034930837
8	2	1	2024-04-13	51.258900000
2	8	1	2024-04-13	0.019508807
9	2	1	2024-04-13	18.407800000
2	9	1	2024-04-13	0.054324797
10	2	1	2024-04-13	0.254520000
2	10	1	2024-04-13	3.928964325
11	2	1	2024-04-13	0.003880160
2	11	1	2024-04-13	257.721331079
12	2	1	2024-04-13	11.944500000
2	12	1	2024-04-13	0.083720541
13	2	1	2024-04-13	34.970800000
2	13	1	2024-04-13	0.028595285
14	2	1	2024-04-13	13.438100000
2	14	1	2024-04-13	0.074415282
15	2	1	2024-04-13	25.443700000
2	15	1	2024-04-13	0.039302460
16	2	1	2024-04-13	93.441900000
2	16	1	2024-04-13	0.010701837
17	2	1	2024-04-13	99.726400000
2	17	1	2024-04-13	0.010027435
18	2	1	2024-04-13	1.963430000
2	18	1	2024-04-13	0.509312784
19	2	1	2024-04-13	1.120500000
2	19	1	2024-04-13	0.892458724
20	2	1	2024-04-13	0.005874260
2	20	1	2024-04-13	170.234208224
21	2	1	2024-04-13	0.208385000
2	21	1	2024-04-13	4.798809895
22	2	1	2024-04-13	68.245600000
2	22	1	2024-04-13	0.014652959
23	2	1	2024-04-13	25.670900000
2	23	1	2024-04-13	0.038954614
24	2	1	2024-04-13	1.048500000
2	24	1	2024-04-13	0.953743443
25	2	1	2024-04-13	12.868500000
2	25	1	2024-04-13	0.077709135
26	2	1	2024-04-13	5.296230000
2	26	1	2024-04-13	0.188813552
27	2	1	2024-04-13	56.153900000
2	27	1	2024-04-13	0.017808202
28	2	1	2024-04-13	8.629180000
2	28	1	2024-04-13	0.115885866
29	2	1	2024-04-13	23.370400000
2	29	1	2024-04-13	0.042789169
30	2	1	2024-04-13	20.032600000
2	30	1	2024-04-13	0.049918633
31	2	1	2024-04-13	123.346100000
2	31	1	2024-04-13	0.008107269
32	2	1	2024-04-13	68.940500000
2	32	1	2024-04-13	0.014505262
33	2	1	2024-04-13	8.544120000
2	33	1	2024-04-13	0.117039555
34	2	1	2024-04-13	2.550830000
2	34	1	2024-04-13	0.392029261
35	2	1	2024-04-13	2.916890000
2	35	1	2024-04-13	0.342830892
36	2	1	2024-04-13	26.697700000
2	36	1	2024-04-13	0.037456410
37	2	1	2024-04-13	0.007371630
2	37	1	2024-04-13	135.655207871
38	2	1	2024-04-13	2.385690000
2	38	1	2024-04-13	0.419165944
39	2	1	2024-04-13	3.929100000
2	39	1	2024-04-13	0.254511211
40	2	1	2024-04-13	8.694280000
2	40	1	2024-04-13	0.115018150
41	2	1	2024-04-13	102.379600000
2	41	1	2024-04-13	0.009767571
42	2	1	2024-04-13	0.854819000
2	42	1	2024-04-13	1.169838293
43	2	1	2024-04-13	5.000480000
2	43	1	2024-04-13	0.199980802
44	2	1	2024-04-13	0.067938000
2	44	1	2024-04-13	14.719302894
45	2	1	2024-04-13	0.610691000
2	45	1	2024-04-13	1.637489336
3	2	1	2024-04-16	60.720600000
2	3	1	2024-04-16	0.016468875
4	2	1	2024-04-16	55.052400000
2	4	1	2024-04-16	0.018164512
5	2	1	2024-04-16	116.378000000
2	5	1	2024-04-16	0.008592689
6	2	1	2024-04-16	0.236479000
2	6	1	2024-04-16	4.228705297
7	2	1	2024-04-16	28.652900000
2	7	1	2024-04-16	0.034900481
8	2	1	2024-04-16	50.971100000
2	8	1	2024-04-16	0.019618961
9	2	1	2024-04-16	18.221800000
2	9	1	2024-04-16	0.054879320
10	2	1	2024-04-16	0.253732000
2	10	1	2024-04-16	3.941166270
11	2	1	2024-04-16	0.003884010
2	11	1	2024-04-16	257.465866463
12	2	1	2024-04-16	11.977100000
2	12	1	2024-04-16	0.083492665
13	2	1	2024-04-16	35.040300000
2	13	1	2024-04-16	0.028538568
14	2	1	2024-04-16	13.362800000
2	14	1	2024-04-16	0.074834615
15	2	1	2024-04-16	25.483800000
2	15	1	2024-04-16	0.039240616
16	2	1	2024-04-16	93.589100000
2	16	1	2024-04-16	0.010685005
17	2	1	2024-04-16	99.793400000
2	17	1	2024-04-16	0.010020703
18	2	1	2024-04-16	1.935270000
2	18	1	2024-04-16	0.516723765
19	2	1	2024-04-16	1.121600000
2	19	1	2024-04-16	0.891583452
20	2	1	2024-04-16	0.005883520
2	20	1	2024-04-16	169.966278690
21	2	1	2024-04-16	0.208956000
2	21	1	2024-04-16	4.785696510
22	2	1	2024-04-16	67.985700000
2	22	1	2024-04-16	0.014708976
23	2	1	2024-04-16	25.711300000
2	23	1	2024-04-16	0.038893405
24	2	1	2024-04-16	1.050150000
2	24	1	2024-04-16	0.952244917
25	2	1	2024-04-16	12.884400000
2	25	1	2024-04-16	0.077613238
26	2	1	2024-04-16	5.286800000
2	26	1	2024-04-16	0.189150337
27	2	1	2024-04-16	55.610600000
2	27	1	2024-04-16	0.017982183
28	2	1	2024-04-16	8.603680000
2	28	1	2024-04-16	0.116229334
29	2	1	2024-04-16	23.275700000
2	29	1	2024-04-16	0.042963262
30	2	1	2024-04-16	20.056000000
2	30	1	2024-04-16	0.049860391
31	2	1	2024-04-16	123.166100000
2	31	1	2024-04-16	0.008119117
32	2	1	2024-04-16	68.795300000
2	32	1	2024-04-16	0.014535877
33	2	1	2024-04-16	8.566590000
2	33	1	2024-04-16	0.116732562
34	2	1	2024-04-16	2.554850000
2	34	1	2024-04-16	0.391412412
35	2	1	2024-04-16	2.921480000
2	35	1	2024-04-16	0.342292263
36	2	1	2024-04-16	26.739700000
2	36	1	2024-04-16	0.037397577
37	2	1	2024-04-16	0.007388420
2	37	1	2024-04-16	135.346934798
38	2	1	2024-04-16	2.375420000
2	38	1	2024-04-16	0.420978185
39	2	1	2024-04-16	3.937610000
2	39	1	2024-04-16	0.253961159
40	2	1	2024-04-16	8.616420000
2	40	1	2024-04-16	0.116057481
41	2	1	2024-04-16	102.529700000
2	41	1	2024-04-16	0.009753271
42	2	1	2024-04-16	0.851302000
2	42	1	2024-04-16	1.174671268
43	2	1	2024-04-16	5.008350000
2	43	1	2024-04-16	0.199666557
44	2	1	2024-04-16	0.067622200
2	44	1	2024-04-16	14.788042980
45	2	1	2024-04-16	0.610138000
2	45	1	2024-04-16	1.638973478
3	2	1	2024-04-17	60.452100000
2	3	1	2024-04-17	0.016542023
4	2	1	2024-04-17	55.337800000
2	4	1	2024-04-17	0.018070830
5	2	1	2024-04-17	117.131800000
2	5	1	2024-04-17	0.008537391
6	2	1	2024-04-17	0.238018000
2	6	1	2024-04-17	4.201362922
7	2	1	2024-04-17	28.721400000
2	7	1	2024-04-17	0.034817244
8	2	1	2024-04-17	51.254600000
2	8	1	2024-04-17	0.019510444
9	2	1	2024-04-17	18.181000000
2	9	1	2024-04-17	0.055002475
10	2	1	2024-04-17	0.252935000
2	10	1	2024-04-17	3.953584913
11	2	1	2024-04-17	0.003896860
2	11	1	2024-04-17	256.616865887
12	2	1	2024-04-17	12.033000000
2	12	1	2024-04-17	0.083104795
13	2	1	2024-04-17	35.235100000
2	13	1	2024-04-17	0.028380791
14	2	1	2024-04-17	13.436700000
2	14	1	2024-04-17	0.074423035
15	2	1	2024-04-17	25.615800000
2	15	1	2024-04-17	0.039038406
16	2	1	2024-04-17	94.074200000
2	16	1	2024-04-17	0.010629907
17	2	1	2024-04-17	99.934100000
2	17	1	2024-04-17	0.010006594
18	2	1	2024-04-17	1.937600000
2	18	1	2024-04-17	0.516102395
19	2	1	2024-04-17	1.126660000
2	19	1	2024-04-17	0.887579216
20	2	1	2024-04-17	0.005926680
2	20	1	2024-04-17	168.728529295
21	2	1	2024-04-17	0.209725000
2	21	1	2024-04-17	4.768148766
22	2	1	2024-04-17	68.348000000
2	22	1	2024-04-17	0.014631006
23	2	1	2024-04-17	25.844600000
2	23	1	2024-04-17	0.038692802
24	2	1	2024-04-17	1.055750000
2	24	1	2024-04-17	0.947193938
25	2	1	2024-04-17	12.933100000
2	25	1	2024-04-17	0.077320983
26	2	1	2024-04-17	5.296760000
2	26	1	2024-04-17	0.188794659
27	2	1	2024-04-17	55.381500000
2	27	1	2024-04-17	0.018056571
28	2	1	2024-04-17	8.622510000
2	28	1	2024-04-17	0.115975511
29	2	1	2024-04-17	23.121400000
2	29	1	2024-04-17	0.043249976
30	2	1	2024-04-17	20.093600000
2	30	1	2024-04-17	0.049767090
31	2	1	2024-04-17	123.836500000
2	31	1	2024-04-17	0.008075164
32	2	1	2024-04-17	68.828100000
2	32	1	2024-04-17	0.014528950
33	2	1	2024-04-17	8.612570000
2	33	1	2024-04-17	0.116109361
34	2	1	2024-04-17	2.568090000
2	34	1	2024-04-17	0.389394453
35	2	1	2024-04-17	2.907450000
2	35	1	2024-04-17	0.343944006
36	2	1	2024-04-17	26.878300000
2	36	1	2024-04-17	0.037204734
37	2	1	2024-04-17	0.007434010
2	37	1	2024-04-17	134.516902721
38	2	1	2024-04-17	2.377190000
2	38	1	2024-04-17	0.420664734
39	2	1	2024-04-17	3.967200000
2	39	1	2024-04-17	0.252066949
40	2	1	2024-04-17	8.673030000
2	40	1	2024-04-17	0.115299959
41	2	1	2024-04-17	102.993400000
2	41	1	2024-04-17	0.009709360
42	2	1	2024-04-17	0.852548000
2	42	1	2024-04-17	1.172954485
43	2	1	2024-04-17	4.923130000
2	43	1	2024-04-17	0.203122810
44	2	1	2024-04-17	0.067460900
2	44	1	2024-04-17	14.823401407
45	2	1	2024-04-17	0.609447000
2	45	1	2024-04-17	1.640831770
3	2	1	2024-04-18	60.442900000
2	3	1	2024-04-18	0.016544540
4	2	1	2024-04-18	55.484800000
2	4	1	2024-04-18	0.018022954
5	2	1	2024-04-18	117.358200000
2	5	1	2024-04-18	0.008520921
6	2	1	2024-04-18	0.238735000
2	6	1	2024-04-18	4.188744843
7	2	1	2024-04-18	28.749500000
2	7	1	2024-04-18	0.034783214
8	2	1	2024-04-18	51.299400000
2	8	1	2024-04-18	0.019493405
9	2	1	2024-04-18	17.921600000
2	9	1	2024-04-18	0.055798589
10	2	1	2024-04-18	0.255137000
2	10	1	2024-04-18	3.919462877
11	2	1	2024-04-18	0.003892710
2	11	1	2024-04-18	256.890443932
12	2	1	2024-04-18	12.066500000
2	12	1	2024-04-18	0.082874073
13	2	1	2024-04-18	35.314200000
2	13	1	2024-04-18	0.028317221
14	2	1	2024-04-18	13.447800000
2	14	1	2024-04-18	0.074361606
15	2	1	2024-04-18	25.683900000
2	15	1	2024-04-18	0.038934897
16	2	1	2024-04-18	94.324200000
2	16	1	2024-04-18	0.010601733
17	2	1	2024-04-18	100.278700000
2	17	1	2024-04-18	0.009972207
18	2	1	2024-04-18	1.944350000
2	18	1	2024-04-18	0.514310695
19	2	1	2024-04-18	1.129660000
2	19	1	2024-04-18	0.885222102
20	2	1	2024-04-18	0.005831120
2	20	1	2024-04-18	171.493641016
21	2	1	2024-04-18	0.210165000
2	21	1	2024-04-18	4.758166203
22	2	1	2024-04-18	68.247000000
2	22	1	2024-04-18	0.014652659
23	2	1	2024-04-18	25.913200000
2	23	1	2024-04-18	0.038590371
24	2	1	2024-04-18	1.059760000
2	24	1	2024-04-18	0.943609874
3	2	1	2024-04-19	60.670700000
2	3	1	2024-04-19	0.016482421
4	2	1	2024-04-19	55.348400000
2	4	1	2024-04-19	0.018067370
5	2	1	2024-04-19	117.144800000
2	5	1	2024-04-19	0.008536444
6	2	1	2024-04-19	0.238770000
2	6	1	2024-04-19	4.188130837
7	2	1	2024-04-19	28.724300000
2	7	1	2024-04-19	0.034813729
8	2	1	2024-04-19	51.178000000
2	8	1	2024-04-19	0.019539646
9	2	1	2024-04-19	17.933900000
2	9	1	2024-04-19	0.055760320
10	2	1	2024-04-19	0.255158000
2	10	1	2024-04-19	3.919140297
11	2	1	2024-04-19	0.003883130
2	11	1	2024-04-19	257.524213714
12	2	1	2024-04-19	12.035300000
2	12	1	2024-04-19	0.083088913
13	2	1	2024-04-19	35.170700000
2	13	1	2024-04-19	0.028432758
14	2	1	2024-04-19	13.415700000
2	14	1	2024-04-19	0.074539532
15	2	1	2024-04-19	25.620700000
2	15	1	2024-04-19	0.039030940
16	2	1	2024-04-19	94.092200000
2	16	1	2024-04-19	0.010627874
17	2	1	2024-04-19	100.531600000
2	17	1	2024-04-19	0.009947121
18	2	1	2024-04-19	1.946570000
2	18	1	2024-04-19	0.513724140
19	2	1	2024-04-19	1.126620000
2	19	1	2024-04-19	0.887610729
20	2	1	2024-04-19	0.005793850
2	20	1	2024-04-19	172.596805233
21	2	1	2024-04-19	0.209611000
2	21	1	2024-04-19	4.770741994
22	2	1	2024-04-19	68.212400000
2	22	1	2024-04-19	0.014660091
23	2	1	2024-04-19	25.849500000
2	23	1	2024-04-19	0.038685468
24	2	1	2024-04-19	1.057140000
2	24	1	2024-04-19	0.945948503
25	2	1	2024-04-19	12.976000000
2	25	1	2024-04-19	0.077065351
26	2	1	2024-04-19	5.261960000
2	26	1	2024-04-19	0.190043254
27	2	1	2024-04-19	55.679100000
2	27	1	2024-04-19	0.017960060
28	2	1	2024-04-19	8.558120000
2	28	1	2024-04-19	0.116848093
29	2	1	2024-04-19	23.198800000
2	29	1	2024-04-19	0.043105678
30	2	1	2024-04-19	20.180600000
2	30	1	2024-04-19	0.049552541
31	2	1	2024-04-19	123.740700000
2	31	1	2024-04-19	0.008081415
32	2	1	2024-04-19	69.251600000
2	32	1	2024-04-19	0.014440100
33	2	1	2024-04-19	8.613580000
2	33	1	2024-04-19	0.116095746
34	2	1	2024-04-19	2.560400000
2	34	1	2024-04-19	0.390563974
35	2	1	2024-04-19	2.895870000
2	35	1	2024-04-19	0.345319369
36	2	1	2024-04-19	26.883500000
2	36	1	2024-04-19	0.037197538
37	2	1	2024-04-19	0.007411780
2	37	1	2024-04-19	134.920356514
38	2	1	2024-04-19	2.379360000
2	38	1	2024-04-19	0.420281084
39	2	1	2024-04-19	3.976340000
2	39	1	2024-04-19	0.251487549
40	2	1	2024-04-19	8.570310000
2	40	1	2024-04-19	0.116681894
41	2	1	2024-04-19	103.568700000
2	41	1	2024-04-19	0.009655427
42	2	1	2024-04-19	0.857886000
2	42	1	2024-04-19	1.165656043
43	2	1	2024-04-19	4.943450000
2	43	1	2024-04-19	0.202287876
44	2	1	2024-04-19	0.068535400
2	44	1	2024-04-19	14.590999688
45	2	1	2024-04-19	0.609603000
2	45	1	2024-04-19	1.640411875
\.


--
-- Data for Name: rates_sources; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.rates_sources (id, title, base_currency, timezone, fine, fine_at, problem_info) FROM stdin;
1	Rus CB	2	Europe/Moscow	t	2024-04-19 01:00:02.101+03	-3007
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.stores (id, company, title, address, geo_lat, geo_long) FROM stdin;
1	1	good store	there	23	33.55
\.


--
-- Data for Name: type_property_values; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.type_property_values (instance, property, "order", value) FROM stdin;
\.


--
-- Data for Name: unit_groups; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.unit_groups (id, title, company, description, base) FROM stdin;
1	Единицы массы	\N	Единицы измерения массы материальных объектов	1
2	Единицы объема	1	Единицы измерения объема материальных объектов	5
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.units (id, company, title, abbr, "group", add, factor) FROM stdin;
1	1	Киллограм	кг	1	0	1
3	1	Грам	г	1	0	0.001
4	1	Литр	л	2	0	0.001
5	1	Метр кубический	м³	2	0	1
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
-- Name: amounts_time; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.amounts_time', 2, true);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 4, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.brands_id_seq', 14, true);


--
-- Name: catalog_brand_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_brand_collections_id_seq', 1, true);


--
-- Name: catalog_brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_brands_id_seq', 22, true);


--
-- Name: catalog_metatypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_metatypes_id_seq', 6, true);


--
-- Name: catalog_product_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_product_offers_id_seq', 16, true);


--
-- Name: catalog_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_products_id_seq', 9, true);


--
-- Name: catalog_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalog_properties_id_seq', 8, true);


--
-- Name: catalogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.catalogs_id_seq', 3, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, true);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.currencies_id_seq', 69, true);


--
-- Name: file_load_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.file_load_tasks_id_seq', 4, true);


--
-- Name: instance_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.instance_types_id_seq', 9, true);


--
-- Name: offer_prices_time; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.offer_prices_time', 4, true);


--
-- Name: price_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.price_types_id_seq', 2, true);


--
-- Name: product_prices_time; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.product_prices_time', 3, true);


--
-- Name: product_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.product_relations_id_seq', 1, true);


--
-- Name: products_relation_kinds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.products_relation_kinds_id_seq', 4, true);


--
-- Name: property_primitives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_primitives_id_seq', 7, true);


--
-- Name: property_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_types_id_seq', 9, true);


--
-- Name: property_value_id; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.property_value_id', 35, true);


--
-- Name: rates_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.rates_sources_id_seq', 1, true);


--
-- Name: relations_time; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.relations_time', 49, true);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.stores_id_seq', 2, true);


--
-- Name: unit_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.unit_groups_id_seq', 2, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.units_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: versions_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.versions_seq', 2, true);


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
-- Name: api_keys api_keys_actor_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_actor_uind UNIQUE (actor);


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
-- Name: brand_property_values brand_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.brand_property_values
    ADD CONSTRAINT brand_property_values_pk PRIMARY KEY (instance, property, "order");


--
-- Name: catalog_brand_collections catalog_brand_collections_brand_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brand_collections
    ADD CONSTRAINT catalog_brand_collections_brand_title_uind UNIQUE (brand, title);


--
-- Name: catalog_brand_collections catalog_brand_collections_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brand_collections
    ADD CONSTRAINT catalog_brand_collections_pk PRIMARY KEY (id);


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
-- Name: catalog_metatype_properties catalog_metatype_properties_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatype_properties
    ADD CONSTRAINT catalog_metatype_properties_pk PRIMARY KEY (metatype, catalog, property);


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
-- Name: catalog_product_offers catalog_product_offers_product_article_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_product_offers
    ADD CONSTRAINT catalog_product_offers_product_article_uind UNIQUE NULLS NOT DISTINCT (product, article);


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
-- Name: file_load_tasks file_load_tasks_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.file_load_tasks
    ADD CONSTRAINT file_load_tasks_pk PRIMARY KEY (id);


--
-- Name: collection_property_values instance_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.collection_property_values
    ADD CONSTRAINT instance_property_values_pk PRIMARY KEY (instance, property, "order");


--
-- Name: instance_types instance_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.instance_types
    ADD CONSTRAINT instance_types_pk PRIMARY KEY (id);


--
-- Name: instance_types instance_types_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.instance_types
    ADD CONSTRAINT instance_types_title_uind UNIQUE (title);


--
-- Name: instance_versions instance_versions_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.instance_versions
    ADD CONSTRAINT instance_versions_pk PRIMARY KEY (instance_type, instance);


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
-- Name: offer_prices offer_prices_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_prices
    ADD CONSTRAINT offer_prices_pk PRIMARY KEY (offer, price_type);


--
-- Name: offer_property_values offer_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_pk PRIMARY KEY (offer, property, "order");


--
-- Name: oo_relation_values oo_relation_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.oo_relation_values
    ADD CONSTRAINT oo_relation_values_pk PRIMARY KEY (relation, source, target);


--
-- Name: op_relation_values op_relation_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.op_relation_values
    ADD CONSTRAINT op_relation_values_pk PRIMARY KEY (relation, source, target);


--
-- Name: options_property_values options_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_pk PRIMARY KEY (value);


--
-- Name: options_property_values options_property_values_property_hash_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_property_hash_uind UNIQUE (property, hash);


--
-- Name: po_relation_values po_relation_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.po_relation_values
    ADD CONSTRAINT po_relation_values_pk PRIMARY KEY (relation, source, target);


--
-- Name: pp_relation_values pp_relation_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.pp_relation_values
    ADD CONSTRAINT pp_relation_values_pk PRIMARY KEY (relation, source, target);


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
-- Name: product_property_values product_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_pk PRIMARY KEY (product, property, "order");


--
-- Name: product_relations product_relations_catalog_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_relations
    ADD CONSTRAINT product_relations_catalog_title_uind UNIQUE (catalog, title);


--
-- Name: product_relations product_relations_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_relations
    ADD CONSTRAINT product_relations_pk PRIMARY KEY (id);


--
-- Name: products_relation_kinds products_relation_kinds_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products_relation_kinds
    ADD CONSTRAINT products_relation_kinds_pk PRIMARY KEY (id);


--
-- Name: products_relation_kinds products_relation_kinds_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products_relation_kinds
    ADD CONSTRAINT products_relation_kinds_title_uind UNIQUE (title);


--
-- Name: property_in_types property_in_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_in_types
    ADD CONSTRAINT property_in_types_pk PRIMARY KEY (type, property);


--
-- Name: property_primitives property_primitives_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_primitives
    ADD CONSTRAINT property_primitives_pk PRIMARY KEY (id);


--
-- Name: property_primitives property_primitives_title_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_primitives
    ADD CONSTRAINT property_primitives_title_uind UNIQUE (title);


--
-- Name: property_types property_types_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_pk PRIMARY KEY (id);


--
-- Name: property_values property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_values
    ADD CONSTRAINT property_values_pk PRIMARY KEY (value_key);


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
-- Name: type_property_values type_property_values_pk; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.type_property_values
    ADD CONSTRAINT type_property_values_pk PRIMARY KEY (instance, property, "order");


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
-- Name: users users_actor_uind; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_actor_uind UNIQUE (actor);


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
-- Name: file_load_tasks_processed_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX file_load_tasks_processed_ind ON public.file_load_tasks USING btree (processed DESC);


--
-- Name: instance_versions_company_version_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX instance_versions_company_version_ind ON public.instance_versions USING btree (company DESC, version DESC);


--
-- Name: offer_amounts_amount_changed_at_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX offer_amounts_amount_changed_at_ind ON public.offer_amounts USING btree (amount, changed_at);


--
-- Name: offer_amounts_version_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX offer_amounts_version_ind ON public.offer_amounts USING btree (version);


--
-- Name: offer_prices_index_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX offer_prices_index_ind ON public.offer_prices USING btree (index DESC);


--
-- Name: offer_prices_price_type_version_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX offer_prices_price_type_version_ind ON public.offer_prices USING btree (price_type, version);


--
-- Name: product_prices_index_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX product_prices_index_ind ON public.product_prices USING btree (index DESC);


--
-- Name: product_prices_price_type_version_ind; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX product_prices_price_type_version_ind ON public.product_prices USING btree (price_type, version);


--
-- Name: property_types_catalog_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_catalog_title_uind ON public.property_types USING btree (catalog, title) WHERE (catalog IS NOT NULL);


--
-- Name: property_types_common_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (title) WHERE (catalog IS NULL);


--
-- Name: property_values_1_value; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX property_values_1_value ON public.property_values USING btree ((((value ->> 'value'::text))::character varying)) WHERE (type = 1);


--
-- Name: property_values_2_value; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX property_values_2_value ON public.property_values USING btree ((((value ->> 'value'::text))::boolean)) WHERE (type = 2);


--
-- Name: property_values_6_value; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX property_values_6_value ON public.property_values USING btree ((((value ->> 'valueIndex'::text))::integer)) WHERE (type = 6);


--
-- Name: property_values_7_value; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX property_values_7_value ON public.property_values USING btree ((((value ->> 'valueIndex'::text))::double precision)) WHERE (type = 7);


--
-- Name: unit_groups_company_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX unit_groups_company_title_uind ON public.unit_groups USING btree (company, title) WHERE (company IS NOT NULL);


--
-- Name: unit_groups_title_cuind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX unit_groups_title_cuind ON public.unit_groups USING btree (title) WHERE (company IS NULL);


--
-- Name: units_group_abbr_cuind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX units_group_abbr_cuind ON public.units USING btree ("group", abbr) WHERE (company IS NULL);


--
-- Name: units_group_company_abbr_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX units_group_company_abbr_uind ON public.units USING btree ("group", company, abbr) WHERE (company IS NOT NULL);


--
-- Name: units_group_company_title_uind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX units_group_company_title_uind ON public.units USING btree ("group", company, title) WHERE (company IS NOT NULL);


--
-- Name: units_group_title_cuind; Type: INDEX; Schema: public; Owner: dev
--

CREATE UNIQUE INDEX units_group_title_cuind ON public.units USING btree ("group", title) WHERE (company IS NULL);


--
-- Name: catalog_product_offers catalog_product_offers_after_delete; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_product_offers_after_delete AFTER DELETE ON public.catalog_product_offers FOR EACH ROW WHEN ((old.article IS NOT NULL)) EXECUTE FUNCTION public.catalog_product_offers_after_delete_fnc();


--
-- Name: catalog_product_offers catalog_product_offers_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_product_offers_after_insert AFTER INSERT ON public.catalog_product_offers FOR EACH ROW WHEN ((new.article IS NOT NULL)) EXECUTE FUNCTION public.catalog_product_offers_after_insert_fnc();


--
-- Name: catalog_product_offers catalog_product_offers_after_update_fnc; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_product_offers_after_update_fnc AFTER UPDATE ON public.catalog_product_offers FOR EACH ROW WHEN (((old.article IS NULL) <> (new.article IS NULL))) EXECUTE FUNCTION public.catalog_product_offers_after_update_fnc();


--
-- Name: catalog_products catalog_products_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_products_after_insert AFTER INSERT ON public.catalog_products FOR EACH ROW EXECUTE FUNCTION public.catalog_products_after_insert_fnc();


--
-- Name: catalog_types catalog_types_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_insert AFTER INSERT ON public.catalog_types FOR EACH ROW WHEN ((new.parent IS NOT NULL)) EXECUTE FUNCTION public.catalog_types_after_insert_fnc();


--
-- Name: catalog_types catalog_types_after_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalog_types_after_update AFTER UPDATE ON public.catalog_types FOR EACH ROW WHEN ((old.parent IS DISTINCT FROM new.parent)) EXECUTE FUNCTION public.catalog_types_after_update_fnc();


--
-- Name: catalogs catalogs_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER catalogs_after_insert AFTER INSERT ON public.catalogs FOR EACH ROW EXECUTE FUNCTION public.catalogs_after_insert_fnc();


--
-- Name: offer_amounts offer_amounts_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER offer_amounts_before_update BEFORE UPDATE ON public.offer_amounts FOR EACH ROW WHEN ((old.amount IS DISTINCT FROM new.amount)) EXECUTE FUNCTION public.offer_amounts_before_update_fnc();


--
-- Name: offer_prices offer_prices_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER offer_prices_before_update BEFORE UPDATE ON public.offer_prices FOR EACH ROW WHEN (((old.index IS DISTINCT FROM new.index) OR (old.deleted IS DISTINCT FROM new.deleted))) EXECUTE FUNCTION public.offer_prices_before_update_fnc();


--
-- Name: oo_relation_values oo_relation_values_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER oo_relation_values_before_update BEFORE UPDATE ON public.oo_relation_values FOR EACH ROW WHEN ((old.deleted IS DISTINCT FROM new.deleted)) EXECUTE FUNCTION public.relations_before_update_fnc();


--
-- Name: op_relation_values op_relation_values_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER op_relation_values_before_update BEFORE UPDATE ON public.op_relation_values FOR EACH ROW WHEN ((old.deleted IS DISTINCT FROM new.deleted)) EXECUTE FUNCTION public.relations_before_update_fnc();


--
-- Name: po_relation_values po_relation_values_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER po_relation_values_before_update BEFORE UPDATE ON public.po_relation_values FOR EACH ROW WHEN ((old.deleted IS DISTINCT FROM new.deleted)) EXECUTE FUNCTION public.relations_before_update_fnc();


--
-- Name: pp_relation_values pp_relation_values_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER pp_relation_values_before_update BEFORE UPDATE ON public.pp_relation_values FOR EACH ROW WHEN ((old.deleted IS DISTINCT FROM new.deleted)) EXECUTE FUNCTION public.relations_before_update_fnc();


--
-- Name: product_prices product_prices_before_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER product_prices_before_update BEFORE UPDATE ON public.product_prices FOR EACH ROW WHEN (((old.index IS DISTINCT FROM new.index) OR (old.deleted IS DISTINCT FROM new.deleted))) EXECUTE FUNCTION public.product_prices_before_update_fnc();


--
-- Name: rates rates_after_insert; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER rates_after_insert AFTER INSERT ON public.rates FOR EACH ROW EXECUTE FUNCTION public.rates_after_update_insert_fnc();


--
-- Name: rates rates_after_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER rates_after_update AFTER UPDATE ON public.rates FOR EACH ROW WHEN ((old.rate IS DISTINCT FROM new.rate)) EXECUTE FUNCTION public.rates_after_update_insert_fnc();


--
-- Name: unit_groups unit_groups_after_update; Type: TRIGGER; Schema: public; Owner: dev
--

CREATE TRIGGER unit_groups_after_update AFTER UPDATE ON public.unit_groups FOR EACH ROW WHEN (((old.base IS DISTINCT FROM new.base) AND (new.base IS NOT NULL) AND (old.base IS NOT NULL))) EXECUTE FUNCTION public.unit_groups_after_update_fnc();


--
-- Name: actors actors_actor_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_actor_types_fk FOREIGN KEY (type) REFERENCES public.actor_types(id);


--
-- Name: actors actors_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id) ON DELETE CASCADE;


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
-- Name: brand_property_values brand_property_values_catalog_brands_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.brand_property_values
    ADD CONSTRAINT brand_property_values_catalog_brands_fk FOREIGN KEY (instance) REFERENCES public.catalog_brands(id) ON DELETE CASCADE;


--
-- Name: brand_property_values brand_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.brand_property_values
    ADD CONSTRAINT brand_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: catalog_brand_collections catalog_brand_collections_catalog_brands_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brand_collections
    ADD CONSTRAINT catalog_brand_collections_catalog_brands_fk FOREIGN KEY (brand) REFERENCES public.catalog_brands(id) ON DELETE CASCADE;


--
-- Name: catalog_brands catalog_brands_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id);


--
-- Name: catalog_metatype_properties catalog_metatype_properties_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatype_properties
    ADD CONSTRAINT catalog_metatype_properties_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id) ON DELETE CASCADE;


--
-- Name: catalog_metatype_properties catalog_metatype_properties_catolog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatype_properties
    ADD CONSTRAINT catalog_metatype_properties_catolog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id);


--
-- Name: catalog_metatype_properties catalog_metatype_properties_metatypes_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_metatype_properties
    ADD CONSTRAINT catalog_metatype_properties_metatypes_fk FOREIGN KEY (metatype) REFERENCES public.metatypes(id);


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
-- Name: catalog_products catalog_products_catalog_brand_collections_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_catalog_brand_collections_fk FOREIGN KEY (collection) REFERENCES public.catalog_brand_collections(id) ON DELETE SET NULL;


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
-- Name: catalog_products catalog_products_units_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_units_fk FOREIGN KEY (accounting_unit) REFERENCES public.units(id);


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
-- Name: collection_property_values collection_property_values_catalog_brand_collections_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.collection_property_values
    ADD CONSTRAINT collection_property_values_catalog_brand_collections_fk FOREIGN KEY (instance) REFERENCES public.catalog_brand_collections(id) ON DELETE CASCADE;


--
-- Name: collection_property_values collection_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.collection_property_values
    ADD CONSTRAINT collection_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: file_load_tasks file_load_tasks_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.file_load_tasks
    ADD CONSTRAINT file_load_tasks_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


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
-- Name: offer_prices offer_prices_catalog_product_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_prices
    ADD CONSTRAINT offer_prices_catalog_product_offers_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offer_prices offer_prices_price_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_prices
    ADD CONSTRAINT offer_prices_price_types_fk FOREIGN KEY (price_type) REFERENCES public.price_types(id) ON DELETE CASCADE;


--
-- Name: offer_property_values offer_property_values_catalog_product_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_product_offers_fk FOREIGN KEY (offer) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: offer_property_values offer_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.offer_property_values
    ADD CONSTRAINT offer_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: oo_relation_values oo_relation_values_catalog_product_offers_source_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.oo_relation_values
    ADD CONSTRAINT oo_relation_values_catalog_product_offers_source_id_fk FOREIGN KEY (source) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: oo_relation_values oo_relation_values_catalog_product_offers_target_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.oo_relation_values
    ADD CONSTRAINT oo_relation_values_catalog_product_offers_target_id_fk FOREIGN KEY (target) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: oo_relation_values oo_relation_values_product_relations_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.oo_relation_values
    ADD CONSTRAINT oo_relation_values_product_relations_fk FOREIGN KEY (relation) REFERENCES public.product_relations(id) ON DELETE CASCADE;


--
-- Name: op_relation_values op_relation_values_catalog_product_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.op_relation_values
    ADD CONSTRAINT op_relation_values_catalog_product_offers_fk FOREIGN KEY (source) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: op_relation_values op_relation_values_catalog_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.op_relation_values
    ADD CONSTRAINT op_relation_values_catalog_products_fk FOREIGN KEY (target) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: op_relation_values op_relation_values_product_relations_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.op_relation_values
    ADD CONSTRAINT op_relation_values_product_relations_fk FOREIGN KEY (relation) REFERENCES public.product_relations(id) ON DELETE CASCADE;


--
-- Name: options_property_values options_property_values_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: options_property_values options_property_values_property_values_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.options_property_values
    ADD CONSTRAINT options_property_values_property_values_fk FOREIGN KEY (value) REFERENCES public.property_values(value_key) ON DELETE CASCADE;


--
-- Name: po_relation_values po_relation_values_catalog_producs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.po_relation_values
    ADD CONSTRAINT po_relation_values_catalog_producs_fk FOREIGN KEY (source) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: po_relation_values po_relation_values_catalog_product_offers_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.po_relation_values
    ADD CONSTRAINT po_relation_values_catalog_product_offers_fk FOREIGN KEY (target) REFERENCES public.catalog_product_offers(id) ON DELETE CASCADE;


--
-- Name: po_relation_values po_relation_values_product_relations_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.po_relation_values
    ADD CONSTRAINT po_relation_values_product_relations_fk FOREIGN KEY (relation) REFERENCES public.product_relations(id) ON DELETE CASCADE;


--
-- Name: pp_relation_values pp_relation_values_catalog_products_source_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.pp_relation_values
    ADD CONSTRAINT pp_relation_values_catalog_products_source_id_fk FOREIGN KEY (source) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: pp_relation_values pp_relation_values_catalog_products_target_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.pp_relation_values
    ADD CONSTRAINT pp_relation_values_catalog_products_target_id_fk FOREIGN KEY (target) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: pp_relation_values pp_relation_values_product_relations_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.pp_relation_values
    ADD CONSTRAINT pp_relation_values_product_relations_fk FOREIGN KEY (relation) REFERENCES public.product_relations(id) ON DELETE CASCADE;


--
-- Name: price_types price_types_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_companies_fk FOREIGN KEY (company) REFERENCES public.companies(id);


--
-- Name: price_types price_types_currencies_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_currencies_fk FOREIGN KEY (display_currency) REFERENCES public.currencies(id) ON DELETE SET NULL;


--
-- Name: price_types price_types_currencies_store_currency_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.price_types
    ADD CONSTRAINT price_types_currencies_store_currency_id_fk FOREIGN KEY (base_currency) REFERENCES public.currencies(id);


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
-- Name: product_property_values product_property_values_catalog_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_products_fk FOREIGN KEY (product) REFERENCES public.catalog_products(id) ON DELETE CASCADE;


--
-- Name: product_property_values product_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_property_values
    ADD CONSTRAINT product_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: product_relations product_relations_catalogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_relations
    ADD CONSTRAINT product_relations_catalogs_fk FOREIGN KEY (catalog) REFERENCES public.catalogs(id) ON DELETE CASCADE;


--
-- Name: product_relations product_relations_product_relations_kinds_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.product_relations
    ADD CONSTRAINT product_relations_product_relations_kinds_fk FOREIGN KEY (kind) REFERENCES public.products_relation_kinds(id) ON DELETE RESTRICT;


--
-- Name: property_in_types property_in_types_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_in_types
    ADD CONSTRAINT property_in_types_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: property_in_types property_in_types_catalog_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.property_in_types
    ADD CONSTRAINT property_in_types_catalog_types_fk FOREIGN KEY (type) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


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
-- Name: type_property_values type_property_values_catalog_properties_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.type_property_values
    ADD CONSTRAINT type_property_values_catalog_properties_fk FOREIGN KEY (property) REFERENCES public.catalog_properties(id) ON DELETE CASCADE;


--
-- Name: type_property_values type_property_values_catalog_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.type_property_values
    ADD CONSTRAINT type_property_values_catalog_types_fk FOREIGN KEY (instance) REFERENCES public.catalog_types(id) ON DELETE CASCADE;


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

