CREATE OR REPLACE FUNCTION public.catalog_types_after_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;
INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES(NEW.parent, NEW.id, 1);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER catalog_types_after_insert
    AFTER INSERT
    ON public.catalog_types
    FOR EACH ROW
    	WHEN (NEW.parent IS NOT NULL)
	EXECUTE PROCEDURE catalog_types_after_insert_fnc();

CREATE OR REPLACE FUNCTION public.catalog_types_after_update_fnc()
RETURNS trigger 
AS $function$
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
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER catalog_types_after_update
	AFTER UPDATE ON catalog_types
	FOR EACH ROW
	WHEN (OLD.parent IS DISTINCT FROM NEW.parent)
	EXECUTE FUNCTION catalog_types_after_update_fnc();

TRUNCATE TABLE public.catalog_types_overload;
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT id, id, 0
FROM catalog_types;
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT parent, id, 1
FROM catalog_types  
WHERE parent is not null;
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, 8, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = 2;
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, 9, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = 8;
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, 10, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = 9;





CREATE OR REPLACE FUNCTION public.rates_after_update_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
INSERT INTO public.rates_history (source, "from", "to", "date", rate)
VALUES(NEW.source, NEW."from", NEW."to", date(NEW."updated_at"), NEW.rate)
ON CONFLICT (source, "from", "to", "date") DO UPDATE SET rate = EXCLUDED.rate;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';


CREATE OR REPLACE TRIGGER rates_after_insert
    AFTER INSERT
    ON public.rates
    FOR EACH ROW
	EXECUTE PROCEDURE rates_after_update_insert_fnc();

CREATE OR REPLACE TRIGGER rates_after_update
    AFTER UPDATE
    ON public.rates
    FOR EACH ROW
	WHEN (OLD.rate IS DISTINCT FROM NEW.rate)
	EXECUTE PROCEDURE rates_after_update_insert_fnc();


CREATE UNIQUE INDEX unit_groups_title_cuind 
ON unit_groups (title)
WHERE company IS NULL;

CREATE UNIQUE INDEX unit_groups_company_title_uind 
ON unit_groups (company, title)
WHERE company IS NOT NULL;

CREATE UNIQUE INDEX units_group_title_cuind 
ON units ("group", title)
WHERE company IS NULL;

CREATE UNIQUE INDEX units_group_company_title_uind 
ON units ("group", company, title)
WHERE company IS NOT NULL;

CREATE UNIQUE INDEX units_group_abbr_cuind 
ON units ("group", abbr)
WHERE company IS NULL;

CREATE UNIQUE INDEX units_group_company_abbr_uind 
ON units ("group", company, abbr)
WHERE company IS NOT NULL;



CREATE OR REPLACE FUNCTION public.unit_groups_after_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
UPDATE units u
SET factor = u.factor/nb.factor, "add" = u."add" - u.factor/nb.factor*u."add"
FROM units AS nb
WHERE
	nb.id=NEW.base
	AND u."group" = NEW.id;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER unit_groups_after_update
    AFTER UPDATE
    ON public.unit_groups
    FOR EACH ROW
	WHEN (OLD.base IS DISTINCT FROM NEW.base AND NEW.base IS NOT NULL AND OLD.base IS NOT NULL)
	EXECUTE PROCEDURE unit_groups_after_update_fnc();


CREATE OR REPLACE FUNCTION public.catalogs_after_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
INSERT INTO catalog_types (catalog, title, parent, root, level)
VALUES (NEW.id, CONCAT('root-', NEW.id), NULL, TRUE, 0);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER catalogs_after_insert
    AFTER INSERT
    ON public.catalogs
    FOR EACH ROW
	EXECUTE PROCEDURE catalogs_after_insert_fnc();


CREATE INDEX property_values_1_value ON property_values (((value ->> 'value')::varchar))
WHERE type = 1;

CREATE OR REPLACE FUNCTION public.catalog_types_after_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
INSERT INTO public.catalog_types_overload (parent, child, delta)
VALUES (NEW.id, NEW.id, 0);
INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER catalog_types_after_insert
    AFTER INSERT
    ON public.catalog_types
    FOR EACH ROW
    	WHEN (NEW.parent IS NOT NULL)
	EXECUTE PROCEDURE catalog_types_after_insert_fnc();

CREATE OR REPLACE FUNCTION public.catalog_types_after_update_fnc()
RETURNS trigger 
AS $function$
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
$function$
LANGUAGE 'plpgsql';

DELETE FROM public.catalog_types_overload AS o
WHERE o.child=OLD.id AND o.parent!=o.child;



INSERT INTO public.catalog_types_overload (parent, child, delta)
SELECT o.parent, NEW.id, o.delta +1
FROM public.catalog_types_overload AS o
WHERE o.child = NEW.parent;



CREATE OR REPLACE TRIGGER catalog_types_after_update
	AFTER UPDATE ON catalog_types
	FOR EACH ROW
	WHEN (OLD.parent IS DISTINCT FROM NEW.parent)
	EXECUTE FUNCTION catalog_types_after_update_fnc();

CREATE OR REPLACE FUNCTION public.catalog_product_offers_after_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count + 1
WHERE id=NEW.product;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.catalog_product_offers_after_delete_fnc()
RETURNS trigger 
AS $function$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count - 1
WHERE id=NEW.product;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.catalog_product_offers_after_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
UPDATE catalog_products
SET offers_count = offers_count - (NEW.article IS NULL)::int + (OLD.article IS NULL)::int
WHERE id=NEW.product;
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';


CREATE OR REPLACE TRIGGER catalog_product_offers_after_insert
	AFTER INSERT ON catalog_product_offers
	FOR EACH ROW
  WHEN (NEW.article IS NOT NULL)
	EXECUTE FUNCTION catalog_product_offers_after_insert_fnc();

CREATE OR REPLACE TRIGGER catalog_product_offers_after_update_fnc
	AFTER UPDATE ON catalog_product_offers
	FOR EACH ROW
	WHEN ((OLD.article IS NULL) != (NEW.article IS NULL))
	EXECUTE FUNCTION catalog_product_offers_after_update_fnc();

CREATE OR REPLACE TRIGGER catalog_product_offers_after_delete
	AFTER DELETE ON catalog_product_offers
	FOR EACH ROW
  WHEN (OLD.article IS NOT NULL)
	EXECUTE FUNCTION catalog_product_offers_after_delete_fnc();

CREATE OR REPLACE FUNCTION public.catalog_products_after_insert_fnc()
RETURNS trigger 
AS $function$
	BEGIN
INSERT INTO catalog_product_offers (catalog, product, article)
VALUES(NEW.catalog, NEW.id, NULL);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER catalog_products_after_insert
	AFTER INSERT ON catalog_products
	FOR EACH ROW
	EXECUTE FUNCTION catalog_products_after_insert_fnc();

CREATE OR REPLACE FUNCTION public.product_prices_before_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
NEW.last_change = NEW."index" - OLD."index";
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('product_prices_time')::int8);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.offer_prices_before_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
NEW.last_change = NEW."index" - OLD."index";
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('offer_prices_time')::int8);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';


CREATE OR REPLACE TRIGGER product_prices_before_update
    BEFORE UPDATE
    ON public.product_prices
    FOR EACH ROW
	WHEN ((OLD."index" IS DISTINCT FROM NEW."index") OR (OLD."deleted" IS DISTINCT FROM NEW."deleted"))
	EXECUTE PROCEDURE product_prices_before_update_fnc();

CREATE OR REPLACE TRIGGER offer_prices_before_update
    BEFORE UPDATE
    ON public.offer_prices
    FOR EACH ROW
	WHEN ((OLD."index" IS DISTINCT FROM NEW."index") OR (OLD."deleted" IS DISTINCT FROM NEW."deleted"))
	EXECUTE PROCEDURE offer_prices_before_update_fnc();


CREATE OR REPLACE FUNCTION public.offer_amounts_before_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('amounts_time')::int8);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER offer_amounts_before_update
    BEFORE UPDATE
    ON public.offer_amounts
    FOR EACH ROW
	WHEN (OLD."amount" IS DISTINCT FROM NEW."amount")
	EXECUTE PROCEDURE offer_amounts_before_update_fnc();

CREATE OR REPLACE FUNCTION public.relations_before_update_fnc()
RETURNS trigger 
AS $function$
	BEGIN
NEW.changed_at = CURRENT_TIMESTAMP;
NEW.version = (SELECT nextval('relations_time')::int8);
RETURN NEW;
	END;
$function$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER pp_relation_values_before_update
    BEFORE UPDATE
    ON public.pp_relation_values
    FOR EACH ROW
	WHEN (OLD."deleted" IS DISTINCT FROM NEW."deleted")
	EXECUTE PROCEDURE relations_before_update_fnc();

CREATE OR REPLACE TRIGGER po_relation_values_before_update
    BEFORE UPDATE
    ON public.po_relation_values
    FOR EACH ROW
	WHEN (OLD."deleted" IS DISTINCT FROM NEW."deleted")
	EXECUTE PROCEDURE relations_before_update_fnc();

CREATE OR REPLACE TRIGGER op_relation_values_before_update
    BEFORE UPDATE
    ON public.op_relation_values
    FOR EACH ROW
	WHEN (OLD."deleted" IS DISTINCT FROM NEW."deleted")
	EXECUTE PROCEDURE relations_before_update_fnc();

CREATE OR REPLACE TRIGGER oo_relation_values_before_update
    BEFORE UPDATE
    ON public.oo_relation_values
    FOR EACH ROW
	WHEN (OLD."deleted" IS DISTINCT FROM NEW."deleted")
	EXECUTE PROCEDURE relations_before_update_fnc();

