for container in postgres_master postgres_worker_1 postgres_worker_2; do
    docker exec $container createdb -U postgres debezium_test
    echo "CREATE EXTENSION citus;" | docker exec -i $container psql -U postgres debezium_test
done

echo "SELECT citus_add_node('postgres_worker_1', 5432);" | docker exec -i postgres_master psql -U postgres debezium_test
echo "SELECT citus_add_node('postgres_worker_2', 5432);" | docker exec -i postgres_master psql -U postgres debezium_test

echo "CREATE ROLE admin WITH PASSWORD 'admin' LOGIN REPLICATION;" | docker exec -i postgres_master psql -U postgres debezium_test
echo "ALTER DATABASE debezium_test OWNER TO test;" | docker exec -i postgres_master psql -U postgres debezium_test