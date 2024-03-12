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
INSERT  INTO public.catalog_types_overload (parent, child, delta)
select parent, id, 1
from catalog_types  
where parent is not null;
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
