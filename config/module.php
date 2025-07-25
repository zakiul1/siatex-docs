<?php

return [
    'primary' => [
        'invoices' => [
            'actions' => ['read', 'write', 'delete'], // permission
            'title' => 'Invoices',
            'icon' => 'Boxes',
            'custom-route' => false,
        ],
        'lc-manage' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'LC Manager',
            'icon' => 'ListTree',
            'custom-route' => false,
        ],
        'inspection-doc' => [
            'actions' => ['read', 'write', 'delete'], // permission
            'title' => 'Inspection Doc.',
            'icon' => 'Images',
            'custom-route' => false,
        ],
        'commertial-doc' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'Commercial Inv.',
            'icon' => 'FileBox',
            'custom-route' => false,
        ],
    ],
    'secondary' => [
        'customers' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'Customers',
            'icon' => 'UsersRound',
            'custom-route' => false,
        ],
        'factories' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'Factories',
            'icon' => 'Tickets',
            'custom-route' => false,
        ],
        'banks' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'Banks',
            'icon' => 'Tickets',
            'custom-route' => false,
        ],
        'shippers' => [
            'actions' => ['read', 'write', 'delete'],
            'title' => 'Shippers',
            'icon' => 'Truck',
            'custom-route' => false,
        ],
    ],
    'settings' => [
        'profile' => [
            'actions' => ['read', 'write', 'delete'],
        ],
    ]
];