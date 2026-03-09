import ShiftMateLogo from '../components/common/ShiftMateLogo';
import {
  Page, Hero, Tagline,
  FeatureGrid, FeatureCard, FeatureIcon, FeatureTitle, FeatureDesc,
  BtnGroup, LoginBtn, RegisterBtn
} from '../styles/FirstPage.styles';

const features = [
    {
    icon: '🏪',
    title: '店舗管理',
    desc: '自分の店舗を登録して、従業員を簡単に管理しましょう。',
  },
  {
    icon: '📅',
    title: 'シフト作成',
    desc: '日付と時間帯ごとにシフトを作成し、人員を配置できます。',
  },
  {
    icon: '✋',
    title: 'シフト申請',
    desc: '従業員は希望のシフトに直接申請し、結果を確認できます。',
  },
  {
    icon: '✅',
    title: '承認・断り',
    desc: '店長が申請内容を確認し、承認または断りの処理ができます。',
  },
  {
    icon: '👥',
    title: '従業員管理',
    desc: '所属従業員の確認から解雇処理まで、一か所で管理できます。',
  },
  {
    icon: '🔔',
    title: '自動承認',
    desc: '自動承認を設定すると、従業員の加入申請が即時処理されます。',
  },
]

export default function FirstPage() {
  return (
    <Page>
      <Hero>
        <ShiftMateLogo size="lg" />
        <Tagline style={{ marginTop: 20 }}>シフト管理をもっとスマートに</Tagline>
      </Hero>

      <FeatureGrid>
        {features.map((f) => (
          <FeatureCard key={f.title}>
            <FeatureIcon>{f.icon}</FeatureIcon>
            <FeatureTitle>{f.title}</FeatureTitle>
            <FeatureDesc>{f.desc}</FeatureDesc>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <BtnGroup>
        <LoginBtn to="/login">ログイン</LoginBtn>
        <RegisterBtn to="/register">会員登録</RegisterBtn>
      </BtnGroup>
    </Page>
  )
}