        "topic.creation.enable": "true",
        "topic.prefix": "fulfillment",
        "table.include.list": "public.table_1",
        "table.whitelist": "public.table_1",
        "include.schema.changes": "true",
        "skip.messages.without.change": "true",
        "key.converter.enhanced.avro.schema.support": "true",
        "value.converter.enhanced.avro.schema.support": "true",
        "key.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter",
        "snapshot.mode": "initial",
        "offset.storage": "file",
        "offset.storage.file.filename": "text.txt",
        "include.transaction": "false",
        "provide.transaction.metadata": "false",
        "key.converter.schemas.enable": "false",
        "value.converter.schemas.enable": "false"
        "transforms.Reroute.type": "io.debezium.transforms.ByLogicalTableRouter",
        "transforms.Reroute.topic.regex": "debezium_test.public.table_1_[0-9]{6}",
        "transforms.Reroute.topic.replacement": "table_1",

            command:
      [
        'postgres',
        '-c',
        'wal_level=logical',
        '-c',
        'wal_writer_delay=10',
        '-c',
        'citus.enable_change_data_capture=on'
      ]
