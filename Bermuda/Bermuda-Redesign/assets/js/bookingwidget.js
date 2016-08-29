/*!
 * Booking Widget functionality
 */
function chkBrowser() { this.ver = navigator.appVersion; this.dom = document.getElementById ? 1 : 0; this.ie5 = (this.ver.indexOf("MSIE 5") > -1 && this.dom) ? 1 : 0; this.ie4 = (document.all && !this.dom) ? 1 : 0; this.ns5 = (this.dom && parseInt(this.ver) >= 5) ? 1 : 0; this.ns4 = (document.layers && !this.dom) ? 1 : 0; this.bVer = (this.ie5 || this.ie4 || this.ns4 || this.ns5); return this; } bVer = new chkBrowser(); ns4 = (document.layers) ? true : false; ie4 = (document.all) ? true : false; function AttB(f) { if (bVer.ie4) f.style.display = ''; } function AttN(f) { if (bVer.ie4) f.style.display = 'none'; }
		    function show(idLayer, idParent) { cLayer = bVer.dom ? document.getElementById(idLayer).style : bVer.ie4 ? document.all[idLayer].style : bVer.ns4 ? idParent ? document[idParent].document[idLayer] : document[idLayer] : 0; cLayer.display = ''; var d = document.getElementById("Wiz"); }
		    function hide(idLayer, idParent) { cLayer = bVer.dom ? document.getElementById(idLayer).style : bVer.ie4 ? document.all[idLayer].style : bVer.ns4 ? idParent ? document[idParent].document[idLayer] : document[idLayer] : 0; cLayer.display = 'none'; }

		    function SetOpts(curTab) {
		        // flt
		        if (curTab == '2') {
		            hide('pac'); hide('hot'); hide('car'); show('flt'); hide('tsh');
		        }
		        // hot
		        else if (curTab == '3') {
		            hide('pac'); hide('flt'); hide('car'); show('hot'); hide('tsh');
		        }
		        // car
		        else if (curTab == '4') {
		            hide('pac'); hide('hot'); hide('flt'); show('car'); hide('tsh');
		        }
		        // tsh
		        else if (curTab == '5') {
		            hide('car'); hide('hot'); hide('flt'); hide('pac'); show('tsh');
		        }
		        // pac
		        else {
		            hide('car'); hide('hot'); hide('flt'); show('pac'); hide('tsh');
		        }
		    }
		    function mrd(i) { if (i == 1) { hide('hotrm2'); hide('hotrm3'); } if (i == 2) { show('hotrm2'); hide('hotrm3'); } if (i == 3) { show('hotrm2'); show('hotrm3'); } }
		    function SyncVals(obj) { var sFldNme = obj.form.name + "." + obj.name; d = document.forms; if (sFldNme == 'CarForm.PickUpLoc' || sFldNme == 'FltForm.ToAirport') { d.CarForm.PickUpLoc.value = d.FltForm.ToAirport.value = obj.value; } else if (sFldNme == 'FltForm.FromDate' || sFldNme == 'CarForm.FromDate') { d.FltForm.FromDate.value = d.CarForm.FromDate.value = obj.value; } else if (sFldNme == 'FltForm.ToDate' || sFldNme == 'CarForm.ToDate') { d.FltForm.ToDate.value = d.CarForm.ToDate.value = obj.value; } else if (sFldNme == 'PkgFormWithFlight.FrAirport' || sFldNme == 'FltForm.FrAirport') { d.FltForm.FrAirport.value = obj.value; } else if (sFldNme == 'FltForm.NumAdult') { d.FltForm.NumAdult.value = obj.value; } else if (sFldNme == 'FltForm.NumChild') { d.FltForm.NumChild.value = obj.value; } else if (sFldNme == 'FltForm.NumSenior') { d.FltForm.NumSenior.value = obj.value; } else if (sFldNme == 'FltForm.FromTime' || sFldNme == 'CarForm.PickUpTime') { d.FltForm.FromTime.value = d.CarForm.PickUpTime.value = obj.value; } else if (sFldNme == 'FltForm.ToTime' || sFldNme == 'CarForm.DropTime') { d.FltForm.ToTime.value = d.CarForm.DropTime.value = obj.value; } }
		    function SetPkgType(i) { var optionIndex = 0; if (3 == i) { hide('PkgWithFlight'); hide('PkgWithFlightCar'); show('PkgNoFlight'); } else if (5 == i) { hide('PkgWithFlight'); hide('PkgNoFlight'); show('PkgWithFlightCar'); } else { hide('PkgNoFlight'); hide('PkgWithFlightCar'); show('PkgWithFlight'); document.getElementById('PkgFormWithFlight').PackageType.value = i; } document.PkgTypeFrm.PrevPkgType.value = i; }

		    function switchFlightMode(flightMode) {
		        if(document.getElementById('flightReturn')){
					var fltRtn = document.getElementById('flightReturn');
				}
				if(fltRtn){
					if (flightMode == 'return') {
						fltRtn.style.display = '';
					}
					else {
						fltRtn.style.display = 'none';
					}
				}
		    }

		    function setMenu(id) {
		        if (id <= 5) {
		            for (i = 1; i < 6; i++) {
		                try {
		                    if (i == id) {
		                        document.getElementById('td' + i).className = "bgColor";
		                        SetOpts(i);
		                        document.getElementById('r' + i).checked = true;
		                    } else {
		                        document.getElementById('td' + i).className = "litebgColor";
		                    }
		                } catch (e) {
		                }
		            }
		        }
		    }

		    function isVisible(oElem) {
		        var sVisibility;
		        var bVisible = true;

		        while (bVisible == true) {
		            oElem = oElem.parentNode;

		            try {
		                sVisibility = oElem.style.display;

		                if (sVisibility == 'none') {
		                    bVisible = false;

		                    break;
		                }
		            } catch (err) {
		                break;
		            }
		        }

		        return bVisible;
		    }


		    function deleteSingleRadio() {
		        var oRadioButton;
		        var oElement;

		        for (var iInc = 0; iInc < document.getElementsByTagName('input').length; iInc++) {
		            oElement = document.getElementsByTagName('input')[iInc];

		            if (oElement.type == 'radio') {
		                if (isVisible(oElement)) {
		                    if (oRadioButton != null) {
		                        oRadioButton = null;
		                        break;
		                    }
		                    else {
		                        oRadioButton = oElement;
		                    }
		                }
		            }
		        }

		        if (oRadioButton != null) oRadioButton.parentNode.removeChild(oRadioButton);
		    }

		    function init() {
		        var tpid = '30001';
		        var dtDate = new Date(new Date().valueOf() + 1814400000);
		        var dtEndDate = new Date(new Date().valueOf() + 1987200000);
		        switch (tpid) {
		            case '30001':
		                var strStartDate = (dtDate.getMonth() + 1) + '/' + dtDate.getDate() + '/' + dtDate.getFullYear() + '';
		                var strEndDate = (dtEndDate.getMonth() + 1) + '/' + dtEndDate.getDate() + '/' + dtEndDate.getFullYear() + '';
		                break;
		            case '30009':
		                var strStartDate = dtDate.getFullYear() + '/' + (dtDate.getMonth() + 1) + '/' + dtDate.getDate() + '';
		                var strEndDate = dtEndDate.getFullYear() + '/' + (dtEndDate.getMonth() + 1) + '/' + dtEndDate.getDate() + '';
		                break;
		            default:
		                var strStartDate = dtDate.getDate() + '/' + (dtDate.getMonth() + 1) + '/' + dtDate.getFullYear() + '';
		                var strEndDate = dtEndDate.getDate() + '/' + (dtEndDate.getMonth() + 1) + '/' + dtEndDate.getFullYear() + '';
		        }
		        d = document.forms;
		        d.PkgFormWithFlight.FromDate.value = d.PkgFormNoFlight.FromDate.value = d.PkgFormWithFlightCar.FromDate.value = d.TshopsForm.StartDate.value = d.FltForm.FromDate.value = d.CarForm.FromDate.value = d.HotForm.InDate.value = strStartDate;
		        d.PkgFormWithFlight.ToDate.value = d.PkgFormNoFlight.ToDate.value = d.PkgFormWithFlightCar.ToDate.value = d.TshopsForm.EndDate.value = d.FltForm.ToDate.value = d.CarForm.ToDate.value = d.HotForm.OutDate.value = strEndDate;
		        setMenu('5'); setMenu('4'); setMenu('3'); setMenu('2'); setMenu('1'); deleteSingleRadio();
		    }// JavaScript Document