### SET UP STEPS

1.Run docker compose file

     docker compose up -d

2.For creating db run create-db shell script

    ./create-db.sh

3.We are currently using postgres role which has superAdmin privileges

4.create table through connecting db

    CREATE TABLE table_1 (
     tenant_id integer,
     id bigserial,
     data text,
     primary key (tenant_id, id)
    );

    SELECT create_distributed_table('table_1', 'tenant_id', shard_count:=2);

5.After create publication

    ./create-publication.sh

Citus [(https://www.citusdata.com/updates/v11-3/#cdc_support]

6.After that register connector

      ./register-postgres-connecter.sh

7.RUN Below command for db changes

     echo "INSERT INTO table_1 (tenant_id, data) VALUES (1, 'a');" | docker exec -i postgres_master psql -U postgres -d debezium_test
