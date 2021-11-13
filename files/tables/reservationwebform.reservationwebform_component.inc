<?php

$schema['reservationwebform_component'] = array(
        'description' => 'The table for storing the subscriber data.',
        'fields' => array(
            'rwid' => array(
                'description' => 'The primary identifier for subscriber.',
                'type' => 'serial',
                'not null' => TRUE,
                'unsigned' => TRUE,
            ),
            'nid' => array(
                'description' => 'nid.',
                'type' => 'int',
                'length' => 10,
                'not null' => TRUE,
                'default'  => '0',
            ),
            'cid' => array(
                'description' => 'nid.',
                'type' => 'int',
                'length' => 10,
                'not null' => TRUE,
                'default'  => 0,
            ),
           'actif' => array(
                'description' => 'nid.',
                'type' => 'int',
                'length' => 10,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
            'calcul_price' => array(
                'description' => 'nid.',
                'type' => 'int',
                'length' => 10,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
            'display_price' => array(
                'description' => 'nid.',
                'type' => 'int',
                'length' => 10,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
            'price' => array(
                'description' => 'Subscriber email.',
                'type' => 'varchar',
                'length' => 255,
                //'not null' => TRUE,
                //'default' => 0,
            ),
            'texte_singulier' => array(
                'description' => 'Subscriber email.',
                'type' => 'varchar',
                'length' => 255,
                //'not null' => TRUE,
                //'default' => 0,
            ),
            'texte_plurier' => array(
                'description' => 'Subscriber email.',
                'type' => 'varchar',
                'length' => 255,
                //'not null' => TRUE,
                //'default' => 0,
            ),
            'data_nb_select' => array(
                'description' => 'Subscriber email.',
                'type' => 'varchar',
                'length' => 255,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
            'data_url_syn' => array(
                'description' => 'Subscriber email.',
                'type' => 'varchar',
                'length' => 255,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
            'data_order' => array(
                'description' => 'montant',
                'type' => 'int',
                'length' => 10,
                //'not null' => TRUE,
                //'default'  => 0,
            ),
        ),
        'primary key' => array('rwid'),
    );

