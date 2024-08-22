<?php

namespace Webkul\Modules\Wix\EstimatedDeliverySlotBundle\Controller\EndpointController;

use App\Helper\BaseHelper;
use App\Core\BaseController;
use App\Entity\CompanyApplication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

use Webkul\Modules\Wix\EstimatedDeliverySlotBundle\Utils\PlatformHelper;

use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Doctrine\ORM\EntityManagerInterface;

/**
 * EndpointController
 * 
 * @Route("/endpoint",name="wixeds_endpoint_")
 */
class EndpointController extends BaseController
{
    /**
     * Constructor.
     *
     * @param BaseHelper $helper basehelper
     */
    public function __construct(TranslatorInterface $translator, BaseHelper $helper, PlatformHelper $platformHelper, EventDispatcherInterface $dispatcher, EntityManagerInterface $entityManager)
    {
        $this->_helper = $helper;
        $this->translate = $translator;
        $this->platformHelper = $platformHelper;
        $this->dispatcher = $dispatcher;
        $this->entityManager = $entityManager;
    }

    /**
     * Function to get the auction Data
     * @param Request            $request            Request Object
     * @param CompanyApplication $companyApplication Application of Company
     *
     * @Route("/order", name="get_order")
     *
     * @ParamConverter("companyApplication", class="App\Entity\CompanyApplication", converter="company_application_converter")
     *
     * @return html
     */
    public function getOrder(Request $request, CompanyApplication $companyApplication) {
        if($request->server->get('REQUEST_METHOD') == 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Headers: X-Requested-With');
            header("HTTP/1.1 200 OK");
            return false;
        }
               
        $html = $this->renderView('@wixeds_twig/view_templates/order/order_view.html.twig');

        $html = json_encode(['status' => 'success', 'html' => $html]);
        return new Response($html, 200, [
            "Access-Control-Allow-Origin" => '*', 
            "Access-Control-Allow-Methods" => "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers" => "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Methods"]
        );
    }
}