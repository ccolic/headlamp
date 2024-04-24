import { useTranslation } from 'react-i18next';
import StorageClass from '../../lib/k8s/storageClass';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ClassList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Storage Classes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={StorageClass}
      columns={[
        'name',
        {
          id: 'provisioner',
          label: t('Provisioner'),
          getter: storageClass => storageClass.provisioner,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getter: storageClass => storageClass.reclaimPolicy,
        },
        {
          id: 'volumeBindingMode',
          label: t('Volume Binding Mode'),
          getter: storageClass => storageClass.volumeBindingMode,
        },
        {
          id: 'allowVolumeExpansion',
          label: t('Allow Volume Expansion'),
          getter: storageClass => storageClass.allowVolumeExpansion,
        },
        'age',
      ]}
    />
  );
}
