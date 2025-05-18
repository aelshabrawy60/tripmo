import MainFooter from "@/components/Templates/Main/MainFooter";
import MainHero from "@/components/Templates/Main/MainHero";
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainTripCard from "@/components/Templates/Main/MainTripCard";

export default function Home() {
  return (
    <div className="">
      <MainLayout>
        <MainNavbar pages={[{"name": "الرئيسية", "link": "/"}, {"name": "الرحلات", "link": "/"}, {"name": "من نحن", "link": "/"}]}/>
        <MainHero img={"/signin-image.jpg"} title={"هل انت مستعد لخوض تجربة سفر ممتعة"}/>
        <MainTripCard tripData={{rate: 4.7, total_price: 900 ,name: "رحلة الي حديقة ميسي", about: "رحلة الي جيج ميسي", availability_type: "fixed", images: ["https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/1/03b62def-c4e6-49e2-bb4b-43b334faa32a-port.jpg"]}}/>
        <MainFooter theme="#5B21F7" pages={[{"name": "الرئيسية", "link": "/"}, {"name": "الرحلات", "link": "/"}, {"name": "من نحن", "link": "/"}]} socialMedia={[{"name": " facebook" ,"link": ""} ]}/>
      </MainLayout>
    </div>
  );
}
