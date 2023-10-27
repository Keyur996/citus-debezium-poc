echo "
CREATE PUBLICATION test_publication FOR TABLE table_1;
SELECT * FROM run_command_on_all_nodes ($\$SELECT pg_create_logical_replication_slot('test_slot', 'pgoutput', false);\$$);
" | docker exec -i postgres_master psql -U postgres -d debezium_test