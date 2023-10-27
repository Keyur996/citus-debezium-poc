for container in postgres_worker_1; do
    echo "
        GRANT USAGE on SCHEMA columnar_internal to admin;
        GRANT SELECT on columnar_internal.chunk to admin;
        GRANT SELECT on columnar_internal.chunk_group to admin;
        GRANT SELECT on columnar_internal.options to admin;
        GRANT SELECT on columnar_internal.stripe to admin;" | docker exec -i $container psql -U postgres debezium_test
done