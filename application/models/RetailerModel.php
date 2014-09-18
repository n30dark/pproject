<?php
/**
 * Philips Sonicare Brush Microsite - Born05
 *
 * BrushPack Object
 *
 * This is the class off a brush
 *
 * @author    Sergio Paulino <sergio@netants.nl>
 * @link      http://www.born05.nl
 * @copyright Copyright (c) Born05
 * @license   All rights reserved
 */

namespace application\models;

class RetailerModel {

    public $id;
    public $name;
    public $website;
    public $logo;

    public function __construct($json) {
        $retailer = json_decode($json);

        $this->id = $retailer['id'];
        $this->name = $retailer['name'];
        $this->website = $retailer['website'];
        $this->logo = $retailer['logo'];

    }

}
