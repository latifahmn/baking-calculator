var app = angular.module('baking-app', ['ngSanitize']);
app.controller('controller', function($scope,$sce) {
	$scope.ingredient = 'Choose ingredients';
	$scope.ingredientList = ['Butter','Brown Sugar','Cocoa Powder','Flour','Icing Sugar','Liquid','Sugar'];

	$scope.units = { 
		cups: {label: 'Cups', unit: 'Cups'},
		oz: {label: 'oz (Ounce)', unit: 'oz'},
		g: {label: 'g (gram)', unit: 'g'}
	};

	$scope.liquidUnits = {
		cups: {label: 'Cups', unit: 'Cups'},
		ml: {label: 'ml', unit: 'ml', liquid: true},
		floz: {label: 'floz (Fluid Ounce)', unit: 'floz', liquid: true}
	};

	$scope.alias = '';
	$scope.frmUnit = 'Units';
	$scope.toUnit = 'Units';	
	$scope.amount = null;
	$scope.result = '';
    $scope.showResult = false;
	$scope.recipeList = {};
	$scope.rName = 'MY RECIPE';
	$scope.ingredientIdx = 0; //idx count starts at 1
    $scope.showOps = false;

    $scope.setIngredient = function(e){
    	$scope.ingredient = e;
    	$scope.alias = e;
    };

    $scope.setAmount = function(e){
    	$scope.amount = e;
    }

    $scope.setFromUnit = function(e){
    	$scope.frmUnit = e;
    }

    $scope.setToUnit = function(e){
    	$scope.toUnit = e;
    }

    $scope.validateAmount = function(){
        //var f = /^\d+(\/\d+)?$/g.test($scope.amount);
        var f = false;
        try {
            var n = eval($scope.amount);
            if (isNaN(n)){
                f = false;
            } else {
                f = true;
            }

        } catch(err){
            f = false;
        }

        if (!f){
            $('#amount').addClass('invalid');
        } else {
            $('#amount').removeClass('invalid');
        }
        return f;
    }

    $scope.validateInputs = function(){
    	var f = false;
    	if ($scope.ingredient != 'Choose ingredients' && $scope.frmUnit != 'Units' && $scope.toUnit != 'Units' && $scope.amount != null && $scope.amount != '' && $scope.validateAmount()){
    		f = true;
    	} 
    	return f;
    }

    $scope.dismissAlert = function(){
        $scope.showOps = false;
        $scope.resetForm();
    }

    $scope.resetForm = function(){
    	$scope.ingredient = 'Choose ingredients';
		$scope.frmUnit = 'Units';
		$scope.toUnit = 'Units';
		$scope.result = '';
		$scope.amount = null;
        $scope.showResult = false;
    }

    $scope.editLiquid = function(){
    	document.getElementById('ingredient').removeAttribute('readonly');
    	document.getElementById('ingredient').value = '';
    }

    $scope.saveLiquid = function(){
    	document.getElementById('ingredient').setAttribute('readonly','readonly');
    	var l = document.getElementById('ingredient').value;
    	if (l==''){
    		document.getElementById('ingredient').value = $scope.ingredient;
    	} else {
    		$scope.ingredient = l;
    	}
    }

    $scope.addRecipe = function(){
    	$scope.ingredientIdx = $scope.ingredientIdx+1;
    	$scope.recipeList['item_'+$scope.ingredientIdx] = { idx: $scope.ingredientIdx, ingredient: $scope.ingredient, weight: $scope.result};
        $scope.resetForm();
    }

    $scope.removeRecipe = function(i){
    	delete $scope.recipeList['item_'+i];
    }

    $scope.editRecipeName = function(){
    	document.getElementById('recipeName').removeAttribute('readonly');
        if ($scope.rName == 'MY RECIPE'){
            document.getElementById('recipeName').value = '';
        }
    	document.getElementById('recipeName').focus();
    	document.getElementById('edit-recipe-btn').style.display = 'none';
    	document.getElementById('save-recipe-btn').style.display = 'inline-block';
    }

    $scope.saveRecipeName = function(){
    	var n = document.getElementById('recipeName').value;      
    	if ( n.length > 0){
    		$scope.rName = n;
    	} else {
    		$scope.rName = 'MY RECIPE';
            document.getElementById('recipeName').value = $scope.rName;
    	}
    	document.getElementById('recipeName').setAttribute('readonly','readonly');
    	document.getElementById('save-recipe-btn').style.display = 'none';
    	document.getElementById('edit-recipe-btn').style.display = 'inline-block';
    }

    $scope.addCustomRecipe = function(){
    	if ($scope.custom!='' && $scope.custom!=null) {
	    	var r = $scope.custom.split(',');
	    	if (r.length == 3){
                var unit = r[1].trim();
                var weight = $scope.beautify(eval(r[0].trim()));
		    	$scope.result = weight + '  ' +unit;
		    	$scope.ingredient = r[2].trim();
		    	$scope.custom = ''; //reset
		    	$scope.addRecipe();
		    }
	    }
    }

    $scope.calculate = function() {
    	if ( $scope.validateInputs()){
            console.log('Convert: '+$scope.amount+ ' '+$scope.frmUnit+' to '+$scope.toUnit);
            //LOOKUP
            var table = chart[$scope.alias];
            var low_b = 0; var high_b = 0;
            var res = 0;
            var amount = eval($scope.amount);
            var frm_index = w_index[$scope.frmUnit];
            var to_index = w_index[$scope.toUnit];
            var m = 1; //multiple of
            var mm = false;
            if ( amount > eval(table["range6"][frm_index])){
                mm = true;
            }

            if (amount > eval(table["range1"][frm_index])){
            
                for(var key in table){ 
                    var cmp = eval(table[key][frm_index]);

                    if (mm){
                        m = Math.round(amount/cmp);
                        console.log('multiple of: '+m);
                    } 

                    if (amount > m*cmp){
                        low_b = m*eval(table[key][to_index]);
                    }
                    else if (amount < m*cmp){
                        high_b = m*eval(table[key][to_index]);
                        break;                

                    } else if (amount == m*cmp){
                        console.log('FOUND EXACT MATCH!');                   
                        res = m*eval(table[key][to_index]);
                        break;
                    }
                                        
                }
                console.log('low: '+low_b+' high: '+high_b);
                console.log('result= '+res);
                //BEAUTIFY RESULT
                if (res==0){
                    res = $scope.beautify(low_b) + ' ~ ' + $scope.beautify(high_b);
                } else {
                    res = $scope.beautify(res);
                }
              
    	    	$scope.result = res +'  ' + $scope.toUnit;
                $sce.trustAsHtml($scope.result);
                $scope.showResult = true;
            } else {
                $scope.showOps = true;
            }
	    }
    }

    $scope.beautify = function(n){
        var first_num = parseInt(n);
        var fraction = '';
        var dec = n-first_num;
        dec = dec.toFixed(2);
        console.log('dec: '+dec);
        switch (dec){
            case '0.25':
                fraction = ' <sup>1</sup>&frasl;<sub>4</sub>';
                break;
            case '0.33':
                fraction = ' <sup>1</sup>&frasl;<sub>3</sub>';
                break;
            case '0.50':
                fraction = ' <sup>1</sup>&frasl;<sub>2</sub>';
                break;
            case '0.67':
                fraction = ' <sup>2</sup>&frasl;<sub>3</sub>';
                break;
            case '0.75':
                fraction = ' <sup>3</sup>&frasl;<sub>4</sub>';
                break;    
        }
        if (first_num==0){
            first_num = '';
        }
        return first_num + fraction;
    }

});

